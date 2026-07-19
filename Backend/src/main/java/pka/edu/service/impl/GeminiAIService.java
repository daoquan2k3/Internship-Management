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

import java.util.Base64;
import java.util.HashMap;
import java.util.Map;

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
            throw new Exception("Gemini API Key is not configured. Please add GEMINI_API_KEY to environment variables.");
        }

        String mimeType = "image/jpeg";
        String lowerUrl = imageUrl.toLowerCase();
        if (lowerUrl.endsWith(".pdf")) {
            mimeType = "application/pdf";
        } else if (lowerUrl.endsWith(".png")) {
            mimeType = "image/png";
        } else if (lowerUrl.endsWith(".jpg") || lowerUrl.endsWith(".jpeg")) {
            mimeType = "image/jpeg";
        } else {
            throw new Exception("AI currently only supports analyzing PDF or Image files (JPG, PNG). Please submit the report in a supported format to use AI.");
        }

        log.info("Bắt đầu tải file báo cáo từ: {}", imageUrl);
        byte[] fileBytes = restTemplate.getForObject(imageUrl, byte[].class);
        if (fileBytes == null) {
            throw new Exception("Unable to download report file from URL.");
        }
        String base64Data = Base64.getEncoder().encodeToString(fileBytes);

        String url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" + geminiApiKey;

        String prompt = "Đây là tài liệu báo cáo thực tập của một sinh viên. Hãy đóng vai trò là một trợ lý AI cho Mentor.\n" +
                "Nhiệm vụ:\n" +
                "1. Tóm tắt 3 ý chính (aiSummary)\n" +
                "2. Chỉ ra các khó khăn sinh viên đang gặp phải (aiBlockers)\n" +
                "3. Đánh giá thái độ/cảm xúc chung: TÍCH CỰC, TRUNG LẬP, hoặc TIÊU CỰC (aiSentiment)\n" +
                "4. Đề xuất 1 câu nhận xét mẫu cho Mentor (aiSuggestedFeedback)\n" +
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

        log.info("Đang gọi Google Gemini API...");
        ResponseEntity<String> response = restTemplate.postForEntity(url, entity, String.class);

        JsonNode rootNode = objectMapper.readTree(response.getBody());
        String textResponse = rootNode.path("candidates").get(0).path("content").path("parts").get(0).path("text").asText();
        
        // Clean markdown block if present
        textResponse = textResponse.replaceAll("```json", "").replaceAll("```", "").trim();

        JsonNode resultNode = objectMapper.readTree(textResponse);

        Map<String, String> resultMap = new HashMap<>();
        resultMap.put("aiSummary", resultNode.path("aiSummary").asText());
        resultMap.put("aiBlockers", resultNode.path("aiBlockers").asText());
        resultMap.put("aiSentiment", resultNode.path("aiSentiment").asText());
        resultMap.put("aiSuggestedFeedback", resultNode.path("aiSuggestedFeedback").asText());

        log.info("Phân tích báo cáo thành công.");
        return resultMap;
    }
}
