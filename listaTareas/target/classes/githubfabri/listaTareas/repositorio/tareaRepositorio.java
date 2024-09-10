package githubfabri.listaTareas.repositorio;

import githubfabri.listaTareas.modelo.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface tareaRepositorio extends JpaRepository<Task, Long> {
    // Método para encontrar una tarea por nombre
    Optional<Task> findByName(String name);
}
