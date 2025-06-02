package hr.fer.unizg.organizator_dogadjaja.config;

import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.transaction.annotation.EnableTransactionManagement;


@Configuration
@EntityScan("hr.fer.unizg.organizator_dogadjaja.domain")
@EnableJpaRepositories("hr.fer.unizg.organizator_dogadjaja.repos")
@EnableTransactionManagement
public class DomainConfig {
}
