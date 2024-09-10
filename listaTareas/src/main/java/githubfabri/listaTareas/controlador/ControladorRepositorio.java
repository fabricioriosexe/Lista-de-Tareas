package githubfabri.listaTareas.controlador;

import githubfabri.listaTareas.modelo.Task;
import githubfabri.listaTareas.repositorio.tareaRepositorio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/tasks")
public class ControladorRepositorio {

    @Autowired
    private tareaRepositorio taskRepository;

    // Obtener todas las tareas
    @GetMapping
    public List<Task> getAllTasks() {
        return taskRepository.findAll();
    }

    // Crear una nueva tarea
    @PostMapping
    public Task createTask(@RequestBody Task task) {
        return taskRepository.save(task);
    }

    // Actualizar una tarea existente por nombre
    @PutMapping("/{name}")
    public ResponseEntity<Task> updateTask(@PathVariable String name, @RequestBody Task updatedTask) {
        Optional<Task> existingTaskOpt = taskRepository.findByName(name);
        if (existingTaskOpt.isPresent()) {
            Task existingTask = existingTaskOpt.get();
            existingTask.setCompleted(updatedTask.isCompleted());
            Task savedTask = taskRepository.save(existingTask);
            return ResponseEntity.ok(savedTask);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // Eliminar una tarea por ID
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTask(@PathVariable Long id) {
        if (taskRepository.existsById(id)) {
            taskRepository.deleteById(id);
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
