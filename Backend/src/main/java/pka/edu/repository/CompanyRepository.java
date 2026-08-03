package pka.edu.repository;

import pka.edu.entity.Company;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CompanyRepository extends JpaRepository<Company, Long> {
    @Query("SELECT c FROM Company c WHERE c.companyCode = :code")
    Optional<Company> findByCompanyCode(@Param("code") String code);

    @Query("SELECT CASE WHEN COUNT(c) > 0 THEN TRUE ELSE FALSE END FROM Company c WHERE c.companyCode = :code")
    boolean existsByCompanyCode(@Param("code") String code);

    @Query("SELECT c FROM Company c WHERE c.isDeleted = false AND (" +
            "(:search IS NULL OR LOWER(c.companyName) LIKE LOWER(CONCAT('%', :search, '%'))) OR " +
            "(:search IS NULL OR LOWER(c.companyCode) LIKE LOWER(CONCAT('%', :search, '%'))) OR " +
            "(:search IS NULL OR LOWER(c.email) LIKE LOWER(CONCAT('%', :search, '%')))" +
            ")")
    Page<Company> searchCompanies(@Param("search") String search, Pageable pageable);
}
