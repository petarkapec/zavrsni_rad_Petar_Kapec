package hr.unizg.fer.organizator_backend.config;

import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.transaction.annotation.EnableTransactionManagement;


@Configuration
@EntityScan("hr.unizg.fer.organizator_backend.domain")
@EnableJpaRepositories("hr.unizg.fer.organizator_backend.repos")
@EnableTransactionManagement
public class DomainConfig {
}
