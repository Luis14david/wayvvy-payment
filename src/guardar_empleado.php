<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <title>Wayvvy Payroll - Empleados</title>

    <link rel="stylesheet" href="styles.css">
</head>

<body class="dashboard-body">

    <aside class="sidebar">

        <h2>Wayvvy Payroll</h2>

        <nav>
            <a href="dashboard.html">Dashboard</a>
            <a href="empleados.html">Empleados</a>
            <a href="#">Nómina</a>
            <a href="#">Asistencia</a>
            <a href="#">Incentivos</a>
            <a href="#">Reportes</a>
            <a href="#">Configuración</a>
        </nav>

    </aside>

    <main class="dashboard-content">

        <h1>Empleados</h1>

        <p>Registrar nuevo empleado</p>

        <form action="guardar_empleado.php" method="POST" class="employee-form">

            <label for="nombre">Nombre</label>
            <input type="text" id="nombre" name="nombre" required>

            <label for="apellido">Apellido</label>
            <input type="text" id="apellido" name="apellido" required>

            <label for="cedula">Cédula</label>
            <input type="text" id="cedula" name="cedula" required>

            <label for="fecha_ingreso">Fecha de ingreso</label>
            <input type="date" id="fecha_ingreso" name="fecha_ingreso" required>

            <label for="tarifa_hora">Tarifa por hora</label>
            <input type="number" step="0.01" id="tarifa_hora" name="tarifa_hora">

            <label for="horas_semanales">Horas semanales</label>
            <input type="number" id="horas_semanales" name="horas_semanales">

            <button type="submit">Guardar empleado</button>

        </form>

    </main>

</body>

</html>