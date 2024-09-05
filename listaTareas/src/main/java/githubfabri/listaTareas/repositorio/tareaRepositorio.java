package githubfabri.listaTareas.repositorio;

import githubfabri.listaTareas.modelo.Task;
import org.springframework.data.jpa.repository.JpaRepository;


public interface tareaRepositorio extends JpaRepository<Task, Long> {
    // Puedes agregar consultas personalizadas aquí si es necesario
}
