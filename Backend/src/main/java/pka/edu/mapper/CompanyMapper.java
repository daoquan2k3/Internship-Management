package pka.edu.mapper;

import pka.edu.dto.request.CompanyCreateRequest;
import pka.edu.dto.request.CompanyUpdateRequest;
import pka.edu.dto.response.CompanyResponse;
import pka.edu.entity.Company;

public class CompanyMapper {

    public static CompanyResponse toDto(Company company) {
        if (company == null) return null;
        
        return CompanyResponse.builder()
                .companyId(company.getCompanyId())
                .companyCode(company.getCompanyCode())
                .companyName(company.getCompanyName())
                .address(company.getAddress())
                .email(company.getEmail())
                .phoneNumber(company.getPhoneNumber())
                .logoUrl(company.getLogoUrl())
                .websiteUrl(company.getWebsiteUrl())
                .isActive(company.isActive())
                .isVerified(company.isVerified())
                .createdAt(company.getCreatedAt())
                .updatedAt(company.getUpdatedAt())
                .build();
    }

    public static Company toEntity(CompanyCreateRequest request) {
        if (request == null) return null;
        
        return Company.builder()
                .companyCode(request.getCompanyCode())
                .companyName(request.getCompanyName())
                .address(request.getAddress())
                .email(request.getEmail())
                .phoneNumber(request.getPhoneNumber())
                .websiteUrl(request.getWebsiteUrl())
                .isActive(true)
                .isDeleted(false)
                .isVerified(false)
                .build();
    }

    public static void updateFromDto(Company company, CompanyUpdateRequest request) {
        if (request == null) return;
        
        if (request.getCompanyName() != null && !request.getCompanyName().isBlank()) {
            company.setCompanyName(request.getCompanyName());
        }
        if (request.getAddress() != null) {
            company.setAddress(request.getAddress());
        }
        if (request.getEmail() != null) {
            company.setEmail(request.getEmail());
        }
        if (request.getPhoneNumber() != null) {
            company.setPhoneNumber(request.getPhoneNumber());
        }
        if (request.getWebsiteUrl() != null) {
            company.setWebsiteUrl(request.getWebsiteUrl());
        }
        if (request.getIsActive() != null) {
            company.setActive(request.getIsActive());
        }
        if (request.getIsVerified() != null) {
            company.setVerified(request.getIsVerified());
        }
    }
}
