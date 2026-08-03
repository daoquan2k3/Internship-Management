package pka.edu.service.impl;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.HashMap;
import java.util.Map;
import java.util.zip.ZipEntry;
import java.util.zip.ZipInputStream;

@Service
@RequiredArgsConstructor
@Slf4j
public class GeminiAIService {

    @Value("${GEMINI_API_KEY:}")
    private String geminiApiKey;

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    public Map<String, String> analyzeReport(String imageUrl) throws Exception {
        if (geminiApiKey == null || geminiApiKey.isEmpty() || geminiApiKey.equals("your_key_here")) {
            throw new Exception("Chưa cấu hình Gemini API Key (GEMINI_API_KEY) trong biến môi trường.");
        }

        log.info("Bắt đầu tải file báo cáo từ: {}", imageUrl);
        ResponseEntity<byte[]> fileEntity;
        try {
            fileEntity = restTemplate.getForEntity(imageUrl, byte[].class);
        } catch (org.springframework.web.client.HttpClientErrorException.Unauthorized e) {
            throw new Exception("Lỗi bảo mật từ Cloudinary (401 Unauthorized). File báo cáo này đã bị chặn quyền truy cập do thiết lập bảo mật. Vui lòng XÓA file báo cáo cũ và UPLOAD lại file mới để sử dụng tính năng AI.");
        } catch (Exception e) {
            throw new Exception("Lỗi khi tải file báo cáo từ lưu trữ: " + e.getMessage());
        }

        byte[] fileBytes = fileEntity.getBody();
        if (fileBytes == null || fileBytes.length == 0) {
            throw new Exception("File báo cáo trống hoặc không thể tải xuống từ đường dẫn.");
        }

        // 1. Thử giải nén và đọc nội dung nếu là file Word (.docx)
        String docxText = extractTextFromDocx(fileBytes);
        if (docxText != null && !docxText.isEmpty()) {
            log.info("Phát hiện file Word (.docx), tiến hành phân tích văn bản trích xuất (độ dài {} ký tự)...", docxText.length());
            return analyzeTextContent(docxText);
        }

        // 2. Nhận diện định dạng file thật qua Magic Bytes và Header
        String mimeType = null;
        if (fileBytes.length >= 4) {
            if (fileBytes[0] == 0x25 && fileBytes[1] == 0x50 && fileBytes[2] == 0x44 && fileBytes[3] == 0x46) {
                mimeType = "application/pdf";
            } else if (fileBytes[0] == (byte)0x89 && fileBytes[1] == 0x50 && fileBytes[2] == 0x4E && fileBytes[3] == 0x47) {
                mimeType = "image/png";
            } else if (fileBytes[0] == (byte)0xFF && fileBytes[1] == (byte)0xD8) {
                mimeType = "image/jpeg";
            }
        }
        if (mimeType == null && fileEntity.getHeaders().getContentType() != null) {
            String type = fileEntity.getHeaders().getContentType().toString().toLowerCase();
            if (type.contains("pdf")) mimeType = "application/pdf";
            else if (type.contains("png")) mimeType = "image/png";
            else if (type.contains("jpg") || type.contains("jpeg")) mimeType = "image/jpeg";
        }

        // 3. Nếu không phải PDF/ảnh, thử đọc như file text thuần (với các file test/txt)
        if (mimeType == null) {
            String fallbackText = new String(fileBytes, StandardCharsets.UTF_8).trim();
            if (!fallbackText.isEmpty() && !fallbackText.contains("\0")) {
                log.info("Không phải PDF/Ảnh/Word, fallback tiến hành phân tích như file text thuần...");
                return analyzeTextContent(fallbackText);
            }
            throw new Exception("AI hiện tại hỗ trợ phân tích file PDF, Word (.docx), ảnh (JPG, PNG) hoặc text. Định dạng file đính kèm không hợp lệ.");
        }

        // 4. Gọi Google Gemini API với inline_data (cho PDF và Ảnh)
        String base64Data = Base64.getEncoder().encodeToString(fileBytes);
        String url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=" + geminiApiKey;

        String prompt = "Đây là tài liệu báo cáo thực tập của một sinh viên. Hãy đóng vai trò là một trợ lý AI chuyên nghiệp cho Mentor/Giáo viên.\n" +
                "Nhiệm vụ:\n" +
                "1. Tóm tắt 3 ý chính gọn gàng (aiSummary)\n" +
                "2. Chỉ ra các khó khăn/hạn chế sinh viên đang gặp phải (aiBlockers)\n" +
                "3. Đánh giá thái độ/cảm xúc chung: TÍCH CỰC, TRUNG LẬP, hoặc TIÊU CỰC (aiSentiment)\n" +
                "4. Đề xuất 1 câu nhận xét/góp ý mang tính xây dựng cho Mentor (aiSuggestedFeedback)\n" +
                "Hãy trả về DƯỚI ĐỊNH DẠNG JSON hợp lệ chính xác như sau:\n" +
                "{\n" +
                "  \"aiSummary\": \"...\",\n" +
                "  \"aiBlockers\": \"...\",\n" +
                "  \"aiSentiment\": \"...\",\n" +
                "  \"aiSuggestedFeedback\": \"...\"\n" +
                "}";

        String requestBody = "{\n" +
                "  \"contents\": [\n" +
                "    {\n" +
                "      \"parts\": [\n" +
                "        {\"text\": \"" + prompt.replace("\n", "\\n").replace("\"", "\\\"") + "\"},\n" +
                "        {\n" +
                "          \"inline_data\": {\n" +
                "            \"mime_type\": \"" + mimeType + "\",\n" +
                "            \"data\": \"" + base64Data + "\"\n" +
                "          }\n" +
                "        }\n" +
                "      ]\n" +
                "    }\n" +
                "  ]\n" +
                "}";

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<String> entity = new HttpEntity<>(requestBody, headers);

        log.info("Đang gọi Google Gemini API (dạng inline {})...", mimeType);
        try {
            ResponseEntity<String> response = restTemplate.postForEntity(url, entity, String.class);
            return parseGeminiResponse(response.getBody());
        } catch (org.springframework.web.client.HttpClientErrorException e) {
            log.error("Lỗi từ Google Gemini API ({}): {}", e.getStatusCode(), e.getResponseBodyAsString());
            String errBody = e.getResponseBodyAsString();
            if (errBody.contains("no pages") || errBody.contains("INVALID_ARGUMENT") || errBody.contains("unable to process")) {
                String fallbackText = new String(fileBytes, StandardCharsets.UTF_8).trim();
                if (fallbackText.length() > 0 && !fallbackText.contains("\0")) {
                    log.info("PDF bị lỗi trang từ AI, fallback tự động chuyển sang phân tích nội dung văn bản...");
                    return analyzeTextContent(fallbackText);
                }
                throw new Exception("File báo cáo PDF này bị lỗi định dạng hoặc không có trang hợp lệ (Lỗi AI: The document has no pages). Vui lòng kiểm tra lại file của sinh viên.");
            }
            throw new Exception("Lỗi từ Google Gemini AI: " + e.getResponseBodyAsString());
        }
    }

    private Map<String, String> analyzeTextContent(String textContent) throws Exception {
        String url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=" + geminiApiKey;

        String prompt = "Đây là nội dung tài liệu báo cáo thực tập của một sinh viên:\n\n--- NỘI DUNG BÁO CÁO ---\n" +
                textContent + "\n--- HẾT NỘI DUNG ---\n\n" +
                "Hãy đóng vai trò là một trợ lý AI chuyên nghiệp cho Mentor/Giáo viên.\n" +
                "Nhiệm vụ:\n" +
                "1. Tóm tắt 3 ý chính gọn gàng (aiSummary)\n" +
                "2. Chỉ ra các khó khăn/hạn chế sinh viên đang gặp phải (aiBlockers)\n" +
                "3. Đánh giá thái độ/cảm xúc chung: TÍCH CỰC, TRUNG LẬP, hoặc TIÊU CỰC (aiSentiment)\n" +
                "4. Đề xuất 1 câu nhận xét/góp ý mang tính xây dựng cho Mentor (aiSuggestedFeedback)\n" +
                "Hãy trả về DƯỚI ĐỊNH DẠNG JSON hợp lệ chính xác như sau:\n" +
                "{\n" +
                "  \"aiSummary\": \"...\",\n" +
                "  \"aiBlockers\": \"...\",\n" +
                "  \"aiSentiment\": \"...\",\n" +
                "  \"aiSuggestedFeedback\": \"...\"\n" +
                "}";

        String requestBody = "{\n" +
                "  \"contents\": [\n" +
                "    {\n" +
                "      \"parts\": [\n" +
                "        {\"text\": \"" + prompt.replace("\\", "\\\\").replace("\r", "").replace("\n", "\\n").replace("\"", "\\\"").replace("\t", " ") + "\"}\n" +
                "      ]\n" +
                "    }\n" +
                "  ]\n" +
                "}";

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<String> entity = new HttpEntity<>(requestBody, headers);

        log.info("Đang gọi Google Gemini API (dạng text thuần)...");
        try {
            ResponseEntity<String> response = restTemplate.postForEntity(url, entity, String.class);
            return parseGeminiResponse(response.getBody());
        } catch (org.springframework.web.client.HttpClientErrorException e) {
            log.error("Lỗi gọi Gemini AI text: {}", e.getResponseBodyAsString());
            throw new Exception("Không thể phân tích nội dung báo cáo từ AI: " + e.getResponseBodyAsString());
        }
    }

    private Map<String, String> parseGeminiResponse(String responseBody) throws Exception {
        JsonNode rootNode = objectMapper.readTree(responseBody);
        JsonNode candidates = rootNode.path("candidates");
        if (candidates.isMissingNode() || candidates.isEmpty()) {
            throw new Exception("AI không trả về kết quả phân tích hợp lệ.");
        }
        String textResponse = candidates.get(0).path("content").path("parts").get(0).path("text").asText();

        textResponse = textResponse.replaceAll("```json", "").replaceAll("```", "").trim();
        int start = textResponse.indexOf('{');
        int end = textResponse.lastIndexOf('}');
        if (start >= 0 && end > start) {
            textResponse = textResponse.substring(start, end + 1);
        }

        JsonNode resultNode = objectMapper.readTree(textResponse);
        Map<String, String> resultMap = new HashMap<>();
        resultMap.put("aiSummary", resultNode.path("aiSummary").asText("Không có tóm tắt"));
        resultMap.put("aiBlockers", resultNode.path("aiBlockers").asText("Không ghi nhận khó khăn"));
        resultMap.put("aiSentiment", resultNode.path("aiSentiment").asText("TRUNG LẬP"));
        resultMap.put("aiSuggestedFeedback", resultNode.path("aiSuggestedFeedback").asText("Thực hiện báo cáo đúng hạn, cần phát huy."));

        log.info("Phân tích báo cáo thành công.");
        return resultMap;
    }

    private String extractTextFromDocx(byte[] fileBytes) {
        if (fileBytes.length < 4 || fileBytes[0] != 0x50 || fileBytes[1] != 0x4B) {
            return null; // Không phải file ZIP/DOCX
        }
        try (ZipInputStream zis = new ZipInputStream(new ByteArrayInputStream(fileBytes))) {
            ZipEntry entry;
            while ((entry = zis.getNextEntry()) != null) {
                if ("word/document.xml".equals(entry.getName())) {
                    ByteArrayOutputStream bos = new ByteArrayOutputStream();
                    byte[] buffer = new byte[4096];
                    int len;
                    while ((len = zis.read(buffer)) > 0) {
                        bos.write(buffer, 0, len);
                    }
                    String xml = bos.toString(StandardCharsets.UTF_8.name());
                    xml = xml.replaceAll("<w:p[^>]*>", "\n").replaceAll("<w:br[^>]*>", "\n");
                    return xml.replaceAll("<[^>]+>", " ").replaceAll("\\s+", " ").trim();
                }
            }
        } catch (Exception e) {
            log.debug("Không phải file docx hoặc lỗi giải nén: {}", e.getMessage());
        }
        return null;
    }
}
