package pka.edu.config;

import pka.edu.entity.SiteTraffic;
import pka.edu.repository.SiteTrafficRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

import java.time.LocalDate;

@Component
@RequiredArgsConstructor
public class TrafficInterceptor implements HandlerInterceptor {
    private final SiteTrafficRepository trafficRepository;

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) {
        if (request.getMethod().equals("GET")) {
            LocalDate today = LocalDate.now();
            SiteTraffic traffic = trafficRepository.findById(today)
                    .orElse(new SiteTraffic(today, 0L));

            traffic.setVisitCount(traffic.getVisitCount() + 1);
            trafficRepository.save(traffic);
        }
        return true;
    }
}