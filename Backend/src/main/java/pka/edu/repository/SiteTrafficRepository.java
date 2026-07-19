package pka.edu.repository;

import pka.edu.entity.SiteTraffic;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;

@Repository
public interface SiteTrafficRepository extends JpaRepository<SiteTraffic, LocalDate> {
}