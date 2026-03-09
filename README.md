# E-Commerce Backend - NestJS

## Descripción del Proyecto

Este es un backend de e-commerce desarrollado en NestJS que fue refactorizado para mejorar su arquitectura, eliminando acoplamiento entre módulos e implementando un sistema event-driven.

## Problemas Encontrados

### 1. Acoplamiento Circular entre Módulos

**Situación inicial:**

- `UserModule` dependía de `RoleModule`
- `RoleModule` dependía de `UserModule`
- `AuthModule` dependía de ambos Esto causaba errores de inyección de dependencias

### 2. Responsabilidades Mezcladas

- `RoleService` llamaba directamente a `UserService` para asignar roles
- `UserService` necesitaba `RoleService` solo para buscar un rol en el registro

## Soluciones Implementadas (SOLID)

### Principio Single Responsibility

- `UserService` solo maneja operaciones de usuario
- `RoleService` solo maneja lógica de roles
- Los eventos comunican entre ellos

### Principio Open/Closed

Implementación **event-driven** usando `@nestjs/event-emitter`:

- Los módulos emiten eventos en lugar de llamarse directamente
- Nuevos listeners pueden agregarse sin modificar código existente

### Dependency Inversion

`RoleService` → emite evento → `NotificationsConsumer` escucha → llama a `UserService`
Ahora los módulos dependen de eventos, no unos de otros.

## Sistema de Eventos

Todos los eventos están definidos en `src/domain/events/`.

| Evento                  | Dónde se emite                       | Quién escucha           | Descripción                                      |
| ----------------------- | ------------------------------------ | ----------------------- | ------------------------------------------------ |
| `user.registered`       | `AuthService` al registrar           | `NotificationsConsumer` | Simula envío de email de bienvenida              |
| `auth.login`            | `AuthService` al hacer login         | `NotificationsConsumer` | Registra el acceso del usuario                   |
| `role.assign.requested` | `RoleService` al asignar rol         | `NotificationsConsumer` | Dispara la asignación real del rol al usuario    |
| `user.role-assigned`    | `UserService` tras asignar el rol    | `NotificationsConsumer` | Confirma que el rol fue asignado correctamente   |
| `product.activated`     | `ProductService` al activar producto | `NotificationsConsumer` | Simula notificación de actualización de catálogo |

---

# Ecommerce App with Nest.js and Postgres

## Description

This project is an ecommerce application built using Nest.js and Postgres. The focus is on writing clean, modular, and testable code, and following a well-organized project structure.

## Technology Stack

- Nest.js
- PostgreSQL
- TypeORM
- Jest

## Getting Started

To get started with this project, follow these steps:

- Clone this repository to your local machine.
- navigate to the nestjs-ecommerce directory.

```bash
cd ./nestjs-ecommerce
```

- start postgres database.

```bash
docker-compose up -d
```

- install app dependencies.

```bash
npm install
```

- run database migrations.

```bash
npm run migration:run
```

if you want to generate any future migration

```bash
npm run migration:generate --name=<migrationName>
```

- run database seeders.

```bash
npm run seed:run
```

- start the applictaion.

```bash
npm run start:dev
```

## Testing

To run the tests, follow these steps:

1. Install dependencies: `npm install`
2. Run the tests: `npm run test`

## Contributing

If you're interested in contributing to this project, please follow these guidelines:

1. Fork the repository
2. Make your changes
3. Submit a pull request
