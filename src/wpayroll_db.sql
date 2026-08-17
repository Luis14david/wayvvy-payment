-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: localhost
-- Tiempo de generación: 11-08-2026 a las 02:53:56
-- Versión del servidor: 10.4.28-MariaDB-log
-- Versión de PHP: 8.0.28

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `wpayroll_db`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `asistencia`
--

CREATE TABLE `asistencia` (
  `id_asistencia` int(11) NOT NULL,
  `id_empleado` int(11) NOT NULL,
  `fecha` date NOT NULL,
  `hora_entrada` time NOT NULL,
  `hora_salida` time DEFAULT NULL,
  `horas_trabajadas` decimal(5,2) DEFAULT NULL,
  `horas_extras` decimal(5,2) DEFAULT NULL,
  `estado` enum('Presente','Ausente','Tardanza','Permiso') NOT NULL,
  `observacion` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `ausencia`
--

CREATE TABLE `ausencia` (
  `id_ausencia` int(11) NOT NULL,
  `id_empleado` int(11) NOT NULL,
  `id_tipo_ausencia` int(11) NOT NULL,
  `fecha_inicio` date DEFAULT NULL,
  `fecha_fin` date DEFAULT NULL,
  `cantidad_dias` date DEFAULT NULL,
  `motivo` varchar(255) DEFAULT NULL,
  `estado` varchar(30) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `concepto_nomina`
--

CREATE TABLE `concepto_nomina` (
  `id_concepto` int(11) NOT NULL,
  `nombre` varchar(100) DEFAULT NULL,
  `tipo` varchar(20) DEFAULT NULL,
  `metodo_calculo` varchar(30) DEFAULT NULL,
  `descripcion` varchar(255) DEFAULT NULL,
  `estado` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `departamentos`
--

CREATE TABLE `departamentos` (
  `id_departamento` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `descripcion` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `detalle_concepto`
--

CREATE TABLE `detalle_concepto` (
  `id_detalle_concepto` int(11) NOT NULL,
  `id_detalle` int(11) NOT NULL,
  `id_concepto` int(11) NOT NULL,
  `id_escala` int(11) DEFAULT NULL,
  `cantidad` decimal(14,2) DEFAULT NULL,
  `monto` decimal(14,2) NOT NULL,
  `base_calculo` decimal(14,2) DEFAULT NULL,
  `tasa_aplicada` decimal(6,4) DEFAULT NULL,
  `anio_calculo` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `detalle_nomina`
--

CREATE TABLE `detalle_nomina` (
  `id_detalle` int(11) NOT NULL,
  `id_nomina` int(11) NOT NULL,
  `id_empleado` int(11) NOT NULL,
  `salario_bruto` decimal(14,2) DEFAULT NULL,
  `total_ingresos` decimal(14,2) DEFAULT NULL,
  `total_deducciones` decimal(14,2) DEFAULT NULL,
  `salario_neto` decimal(14,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `empleados`
--

CREATE TABLE `empleados` (
  `id_empleado` int(11) NOT NULL,
  `nombres` varchar(50) NOT NULL,
  `apellidos` varchar(50) NOT NULL,
  `cedula` varchar(11) NOT NULL,
  `sexo` enum('Femenino','Masculino') NOT NULL,
  `fecha_nacimiento` date DEFAULT NULL,
  `telefono` varchar(15) DEFAULT NULL,
  `correo` varchar(100) DEFAULT NULL,
  `direccion` varchar(200) DEFAULT NULL,
  `fecha_ingreso` date NOT NULL,
  `salario_base` decimal(10,2) NOT NULL,
  `id_puesto` int(11) NOT NULL,
  `estado` enum('Activo','Inactivo','Licencia') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `escala_isr`
--

CREATE TABLE `escala_isr` (
  `id_escala` int(11) NOT NULL,
  `anio` int(11) DEFAULT NULL,
  `tramo` int(11) DEFAULT NULL,
  `limite_inferior` decimal(14,2) DEFAULT NULL,
  `limite_superior` decimal(14,2) DEFAULT NULL,
  `tasa` decimal(6,4) DEFAULT NULL,
  `monto_fijo` decimal(14,2) DEFAULT NULL,
  `estado` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `historial_salario`
--

CREATE TABLE `historial_salario` (
  `id_historial` int(11) NOT NULL,
  `id_empleado` int(11) NOT NULL,
  `fecha_inicio` date DEFAULT NULL,
  `salario` decimal(14,2) DEFAULT NULL,
  `motivo_cambio` varchar(255) DEFAULT NULL,
  `registrado_por` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `nomina`
--

CREATE TABLE `nomina` (
  `id_nomina` int(11) NOT NULL,
  `periodo_inicio` date DEFAULT NULL,
  `periodo_fin` date DEFAULT NULL,
  `fecha_pago` date DEFAULT NULL,
  `anio` int(11) DEFAULT NULL,
  `estado` enum('Borrador','Procesada','Pagada','Anulada') DEFAULT NULL,
  `total_bruto` decimal(14,2) DEFAULT NULL,
  `total_deducciones` decimal(14,2) DEFAULT NULL,
  `total_neto` decimal(14,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `puestos`
--

CREATE TABLE `puestos` (
  `id_puesto` int(11) NOT NULL,
  `nombre_puesto` varchar(100) NOT NULL,
  `descripcion` text NOT NULL,
  `id_departamento` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `rol`
--

CREATE TABLE `rol` (
  `id_rol` int(11) NOT NULL,
  `nombre` varchar(50) NOT NULL,
  `descripcion` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tipo_ausencia`
--

CREATE TABLE `tipo_ausencia` (
  `id_tipo_ausencia` int(11) NOT NULL,
  `nombre` enum('Vacaciones','Permiso','Incapacidad','Ausencia injustificada') DEFAULT NULL,
  `afecta_nomina` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `id_usuario` int(11) NOT NULL,
  `id_empleado` int(11) NOT NULL,
  `id_rol` int(11) NOT NULL,
  `usuario` varchar(50) NOT NULL,
  `password_hash` varchar(50) DEFAULT NULL,
  `estado` varchar(20) DEFAULT NULL,
  `ultimo_acceso` datetime DEFAULT NULL,
  `intentos_fallidos` int(11) DEFAULT 0,
  `bloqueado_hasta` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `asistencia`
--
ALTER TABLE `asistencia`
  ADD PRIMARY KEY (`id_asistencia`),
  ADD KEY `fk_id_empleado` (`id_empleado`);

--
-- Indices de la tabla `ausencia`
--
ALTER TABLE `ausencia`
  ADD PRIMARY KEY (`id_ausencia`),
  ADD KEY `fk_id_empleado` (`id_empleado`) USING BTREE,
  ADD KEY `fk_id_tipo_ausencia` (`id_tipo_ausencia`) USING BTREE;

--
-- Indices de la tabla `concepto_nomina`
--
ALTER TABLE `concepto_nomina`
  ADD PRIMARY KEY (`id_concepto`);

--
-- Indices de la tabla `departamentos`
--
ALTER TABLE `departamentos`
  ADD PRIMARY KEY (`id_departamento`);

--
-- Indices de la tabla `detalle_concepto`
--
ALTER TABLE `detalle_concepto`
  ADD PRIMARY KEY (`id_detalle_concepto`),
  ADD KEY `id_detalle` (`id_detalle`),
  ADD KEY `id_concepto` (`id_concepto`),
  ADD KEY `id_escala` (`id_escala`);

--
-- Indices de la tabla `detalle_nomina`
--
ALTER TABLE `detalle_nomina`
  ADD PRIMARY KEY (`id_detalle`),
  ADD KEY `fk_id_nomina` (`id_nomina`),
  ADD KEY `id_empleado` (`id_empleado`);

--
-- Indices de la tabla `empleados`
--
ALTER TABLE `empleados`
  ADD PRIMARY KEY (`id_empleado`),
  ADD UNIQUE KEY `cedula` (`cedula`),
  ADD KEY `fk_id_puesto` (`id_puesto`);

--
-- Indices de la tabla `escala_isr`
--
ALTER TABLE `escala_isr`
  ADD PRIMARY KEY (`id_escala`);

--
-- Indices de la tabla `historial_salario`
--
ALTER TABLE `historial_salario`
  ADD PRIMARY KEY (`id_historial`),
  ADD KEY `id_empleado` (`id_empleado`),
  ADD KEY `registrado_por` (`registrado_por`);

--
-- Indices de la tabla `nomina`
--
ALTER TABLE `nomina`
  ADD PRIMARY KEY (`id_nomina`);

--
-- Indices de la tabla `puestos`
--
ALTER TABLE `puestos`
  ADD PRIMARY KEY (`id_puesto`),
  ADD KEY `fk_id_departamento` (`id_departamento`);

--
-- Indices de la tabla `rol`
--
ALTER TABLE `rol`
  ADD PRIMARY KEY (`id_rol`),
  ADD UNIQUE KEY `nombre` (`nombre`);

--
-- Indices de la tabla `tipo_ausencia`
--
ALTER TABLE `tipo_ausencia`
  ADD PRIMARY KEY (`id_tipo_ausencia`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id_usuario`),
  ADD UNIQUE KEY `usuario` (`usuario`),
  ADD UNIQUE KEY `fk_id_empleado` (`id_empleado`) USING BTREE,
  ADD KEY `fk_id_rol` (`id_rol`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `asistencia`
--
ALTER TABLE `asistencia`
  MODIFY `id_asistencia` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `ausencia`
--
ALTER TABLE `ausencia`
  MODIFY `id_ausencia` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `concepto_nomina`
--
ALTER TABLE `concepto_nomina`
  MODIFY `id_concepto` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `departamentos`
--
ALTER TABLE `departamentos`
  MODIFY `id_departamento` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `detalle_concepto`
--
ALTER TABLE `detalle_concepto`
  MODIFY `id_detalle_concepto` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `detalle_nomina`
--
ALTER TABLE `detalle_nomina`
  MODIFY `id_detalle` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `empleados`
--
ALTER TABLE `empleados`
  MODIFY `id_empleado` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `escala_isr`
--
ALTER TABLE `escala_isr`
  MODIFY `id_escala` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `historial_salario`
--
ALTER TABLE `historial_salario`
  MODIFY `id_historial` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `nomina`
--
ALTER TABLE `nomina`
  MODIFY `id_nomina` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `puestos`
--
ALTER TABLE `puestos`
  MODIFY `id_puesto` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `rol`
--
ALTER TABLE `rol`
  MODIFY `id_rol` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `tipo_ausencia`
--
ALTER TABLE `tipo_ausencia`
  MODIFY `id_tipo_ausencia` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id_usuario` int(11) NOT NULL AUTO_INCREMENT;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `asistencia`
--
ALTER TABLE `asistencia`
  ADD CONSTRAINT `fk_id_empleado` FOREIGN KEY (`id_empleado`) REFERENCES `empleados` (`id_empleado`);

--
-- Filtros para la tabla `ausencia`
--
ALTER TABLE `ausencia`
  ADD CONSTRAINT `ausencia_ibfk_1` FOREIGN KEY (`id_empleado`) REFERENCES `empleados` (`id_empleado`),
  ADD CONSTRAINT `ausencia_ibfk_2` FOREIGN KEY (`id_tipo_ausencia`) REFERENCES `tipo_ausencia` (`id_tipo_ausencia`);

--
-- Filtros para la tabla `detalle_concepto`
--
ALTER TABLE `detalle_concepto`
  ADD CONSTRAINT `detalle_concepto_ibfk_1` FOREIGN KEY (`id_detalle`) REFERENCES `detalle_nomina` (`id_detalle`),
  ADD CONSTRAINT `detalle_concepto_ibfk_2` FOREIGN KEY (`id_concepto`) REFERENCES `concepto_nomina` (`id_concepto`),
  ADD CONSTRAINT `detalle_concepto_ibfk_3` FOREIGN KEY (`id_escala`) REFERENCES `escala_isr` (`id_escala`);

--
-- Filtros para la tabla `detalle_nomina`
--
ALTER TABLE `detalle_nomina`
  ADD CONSTRAINT `detalle_nomina_ibfk_1` FOREIGN KEY (`id_empleado`) REFERENCES `empleados` (`id_empleado`),
  ADD CONSTRAINT `fk_id_nomina` FOREIGN KEY (`id_nomina`) REFERENCES `nomina` (`id_nomina`);

--
-- Filtros para la tabla `empleados`
--
ALTER TABLE `empleados`
  ADD CONSTRAINT `fk_id_puesto` FOREIGN KEY (`id_puesto`) REFERENCES `puestos` (`id_puesto`);

--
-- Filtros para la tabla `historial_salario`
--
ALTER TABLE `historial_salario`
  ADD CONSTRAINT `historial_salario_ibfk_1` FOREIGN KEY (`id_empleado`) REFERENCES `empleados` (`id_empleado`),
  ADD CONSTRAINT `historial_salario_ibfk_2` FOREIGN KEY (`registrado_por`) REFERENCES `usuarios` (`id_usuario`);

--
-- Filtros para la tabla `puestos`
--
ALTER TABLE `puestos`
  ADD CONSTRAINT `fk_id_departamento` FOREIGN KEY (`id_departamento`) REFERENCES `departamentos` (`id_departamento`);

--
-- Filtros para la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD CONSTRAINT `fk_id_rol` FOREIGN KEY (`id_rol`) REFERENCES `rol` (`id_rol`),
  ADD CONSTRAINT `usuarios_ibfk_1` FOREIGN KEY (`id_empleado`) REFERENCES `empleados` (`id_empleado`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
