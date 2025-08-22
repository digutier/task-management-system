# Sistema de Gestión de Tareas - Desafío de programación

### **Objetivo**: Desarrollar un pequeño servicio web para gestionar tareas (TODO list).

## 🚀 **Instrucciones para Ejecutar Localmente**

### **Prerrequisitos**
Asegúrate de tener instalado:
- **Ruby** 3.0+ 
- **Rails** 7.0+
- **PostgreSQL**
- **Node.js** 16+
- **Yarn** o **npm**

### **Instalación y Configuración**

#### **1. Instalar dependencias**
```bash
# Dependencias de Ruby
bundle install

# Dependencias de JavaScript
yarn install
# o
npm install
```

#### **2. Configurar base de datos**
```bash
# Crear y configurar la base de datos
rails db:create
rails db:migrate
rails db:seed
```

#### **3. Ejecutar el proyecto**
```bash
# Iniciar servidor Rails
rails server
# o
rails s

# En otra terminal (opcional)
bin/dev
```

#### **4. Acceder a la aplicación**

## ¿Qué parte del código fue generado con IA?

Se realizó un prompt inicial en base a instrucciones y reglas (una especie de context engineering) para que el agente pueda crear una base con la cual trabajar. Creó todos los controladores necesarios, las vistas, los modelos, logica javascript con stimulus, etc. 

### Prompt inicial:
Create a new project in ruby on rails. Use CLAUDE.md file as context and read it carefully and consider every detail/rules while creating this project. The PLANNING.md file has all the requirements for this project. If you have any question or doubts don't assume anything, ask me and i will give you the answers.

### Pregunta:
Questions before I start:
Database: I see you have PostgreSQL configured. Should I proceed with PostgreSQL or would you prefer SQLite for development?
notify_to field: The planning shows notify_to -> Array of user ids. Should this be a simple array field, or do you want a separate notification/junction table for better relational integrity?
Weight field: For both Task and List models, what should be the logic for weight assignment? Should it auto-increment, or should users manually set it?
Styling: Any preference for CSS framework (Bootstrap, Tailwind) or should I use plain CSS with Rails' default styling?
Estimated_time field: The planning shows estimated_time -> date but this seems like it should be a duration rather than a date. Should this be hours/minutes, or did you mean something else?

### Respuesta:
1: Proceed with PostgreSQL. 2: Make a simple array field, it should contain users ids. 3: For the moment let's do weight field auto-increment. 4: CSS with Tailwind. 5: Lets assume for estimated_time as the date when the task will be done, instead of the time that takes to complete.

Luego para ir añadiendo nuevas funcionalidades pequeñas se fue realizando peticiones simples a la IA para que las añadiera. Por ejemplo la capacidad de hacer drag and drop de las tareas tanto para la lista como entre listas, botón de añadir tarea con campos para el título y sus notas, botón para añadir lista, etc.

## ¿Cómo hiciste la validación de ese código?

Como es un stack tecnológico con el que nunca había trabajado antes, me tomé el tiempo para revisar linea por linea el código aprendiendo sobre el lenguaje Ruby y el framework Rails, patrones de diseño, sintaxis, etc. Cada vez que no entendía bien lo que realizaba le preguntaba a la IA para que me explicara. El proyecto sirvió para aprender sobre estas tecnologías.

## ¿Por qué tomaste ciertas decisiones de diseño o arquitectura?

Como estoy acostumbrado a trabajar con Angular y NestJS donde se suele hacer la separación entre controladores, vista y modelo (MVC), me preocupé de aplicar lo mismo para este caso. Con el prompt inicial no había mucho orden en cuanto a directorios, estaba muy desordenado y se entendía poco, por lo cual se reordenaron para mejorar la legibilidad.

Al ser una aplicación simple se optó por usar las herramientas por defecto de Rails como el ActiveRecord, convención RESTful, la integración con base de datos PostgreSQL, arquitectura basada en eventos con el uso de Stimulus.

## Alguna parte del código que consideres que la IA te generó de forma "incorrecta"

En general todo lo que generaba era correcto, sin embargo, se presentó mucha redundancia en muchos métodos que compartían código similar, por ende la refactorización era necesaria. También resolvía bugs de forma incorrecta y repetía las mismas propuesta de solución erróneas. También solía proponer soluciones radicales poco mantenibles o con malas prácticas.

## ¿Cuánto tiempo te tomó hacer el ejercicio?

Alrededor de 8 horas.

## Features principales

- Visualizador de listas:
  - Creación de listas
  - Creación de tareas -> LLM genera estimación de tiempo en base al título y las notas de la tarea.
  - Drag & drop de tareas dentro de una misma lista y entre listas.
  - Marcar como completada una tarea o no completada.
- Edición de tarea:
  - Se puede editar información como nombre, notas, fecha limite, asignado/a, etc.
  - Al editar notas, el LLM hará una nueva estimación de tiempo.

## Tareas pendientes

- Borrado lógico de tareas y listas.
- Drag & drop de listas.
- Disponibilizar token válido para LLM de OpenAI.
- Implementar testing.
- Revisar problemas linter.

## Bugs

- Al crear una tarea en una lista, no se puede hacer drag & drop en esa tarea hasta hacer refresh de la página.

## Screenshots
Vista inicial:
<img width="1510" height="823" alt="Screenshot 2025-08-22 at 11 42 26 AM" src="https://github.com/user-attachments/assets/bf4e61fb-65c7-472f-a31a-f2ed392e03de" />

Listas expandidas:
<img width="1510" height="823" alt="Screenshot 2025-08-22 at 11 42 44 AM" src="https://github.com/user-attachments/assets/a4dcb0e1-743c-4fce-8d23-23d8312f684e" />

Crendo nueva tarea dentro de una lista:
<img width="1512" height="822" alt="Screenshot 2025-08-22 at 11 43 27 AM" src="https://github.com/user-attachments/assets/b318cf6f-c3d1-4485-9fc9-abe57f8ffea2" />

Detalles de una tarea:
<img width="1512" height="822" alt="Screenshot 2025-08-22 at 11 44 12 AM" src="https://github.com/user-attachments/assets/19b4d3bc-3b8b-43b5-bca0-0b347887c865" />
