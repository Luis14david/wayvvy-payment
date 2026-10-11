-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Oct 11, 2026 at 05:54 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `wpayroll_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `asistencia`
--

CREATE TABLE `asistencia` (
  `id_asistencia` int(11) NOT NULL,
  `id_empleado` int(11) NOT NULL,
  `fecha` date NOT NULL,
  `hora_entrada` time DEFAULT NULL,
  `hora_salida` time DEFAULT NULL,
  `horas_trabajadas` decimal(5,2) DEFAULT NULL,
  `horas_extras` decimal(5,2) DEFAULT NULL,
  `estado` enum('Presente','Ausente','Tardanza','Permiso') NOT NULL,
  `observacion` varchar(255) DEFAULT NULL,
  `minutos_regulares` int(10) UNSIGNED DEFAULT NULL,
  `minutos_extras` int(10) UNSIGNED DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `asistencia`
--

INSERT INTO `asistencia` (`id_asistencia`, `id_empleado`, `fecha`, `hora_entrada`, `hora_salida`, `horas_trabajadas`, `horas_extras`, `estado`, `observacion`, `minutos_regulares`, `minutos_extras`) VALUES
(31, 7, '2026-08-24', NULL, NULL, 0.00, 0.00, 'Presente', NULL, 0, 0),
(32, 7, '2026-08-25', NULL, NULL, 0.00, 0.00, 'Presente', NULL, 0, 0),
(33, 7, '2026-08-26', NULL, NULL, 0.00, 0.00, 'Presente', NULL, 0, 0),
(34, 7, '2026-08-27', NULL, NULL, 0.00, 0.00, 'Presente', NULL, 0, 0),
(35, 7, '2026-08-28', NULL, NULL, 0.00, 0.00, 'Presente', NULL, 0, 0),
(36, 7, '2026-08-29', NULL, NULL, 0.00, 0.00, 'Presente', NULL, 0, 0),
(68, 2, '2026-08-24', NULL, NULL, 0.00, 0.00, 'Presente', NULL, 0, 0),
(69, 2, '2026-08-25', NULL, NULL, 0.00, 0.00, 'Presente', NULL, 0, 0),
(70, 2, '2026-08-26', NULL, NULL, 0.00, 0.00, 'Presente', NULL, 0, 0),
(71, 2, '2026-08-27', NULL, NULL, 0.00, 0.00, 'Presente', NULL, 0, 0),
(72, 2, '2026-08-28', NULL, NULL, 0.00, 0.00, 'Presente', NULL, 0, 0),
(73, 2, '2026-08-29', NULL, NULL, 0.00, 0.00, 'Presente', NULL, 0, 0),
(86, 2, '2026-09-07', NULL, NULL, 0.00, 0.00, 'Presente', NULL, 0, 0),
(87, 2, '2026-09-08', NULL, NULL, 0.00, 0.00, 'Presente', NULL, 0, 0),
(88, 2, '2026-09-09', NULL, NULL, 0.00, 0.00, 'Presente', NULL, 0, 0),
(89, 2, '2026-09-10', NULL, NULL, 0.00, 0.00, 'Presente', NULL, 0, 0),
(90, 2, '2026-09-11', NULL, NULL, 0.00, 0.00, 'Presente', NULL, 0, 0),
(91, 2, '2026-09-12', NULL, NULL, 0.00, 0.00, 'Presente', NULL, 0, 0),
(92, 7, '2026-09-07', NULL, NULL, 0.00, 0.00, 'Presente', NULL, 0, 0),
(93, 7, '2026-09-08', NULL, NULL, 0.00, 0.00, 'Presente', NULL, 0, 0),
(94, 7, '2026-09-10', NULL, NULL, 0.00, 0.00, 'Presente', NULL, 0, 0),
(95, 2, '2026-09-21', NULL, NULL, 0.00, 0.00, 'Presente', NULL, 0, 0),
(96, 2, '2026-09-22', NULL, NULL, 0.00, 0.00, 'Presente', NULL, 0, 0),
(97, 2, '2026-09-23', NULL, NULL, 0.00, 0.00, 'Presente', NULL, 0, 0),
(98, 2, '2026-09-24', NULL, NULL, 0.00, 0.00, 'Presente', NULL, 0, 0),
(99, 2, '2026-09-25', NULL, NULL, 0.00, 0.00, 'Presente', NULL, 0, 0),
(100, 2, '2026-09-26', NULL, NULL, 0.00, 0.00, 'Presente', NULL, 0, 0),
(119, 2, '2026-09-28', NULL, NULL, 0.00, 0.00, 'Presente', NULL, 0, 0),
(159, 2, '2026-09-29', NULL, NULL, 0.00, 0.00, 'Presente', NULL, 0, 0),
(179, 2, '2026-09-19', NULL, NULL, 0.00, 0.00, 'Presente', NULL, 0, 0),
(201, 2, '2026-09-30', NULL, NULL, 0.00, 0.00, 'Presente', NULL, 0, 0),
(208, 2, '2026-09-14', NULL, NULL, 0.00, 0.00, 'Presente', NULL, 0, 0),
(218, 8, '2026-09-01', NULL, NULL, 0.00, 0.00, 'Presente', NULL, 0, 0),
(219, 8, '2026-09-02', NULL, NULL, 0.00, 0.00, 'Presente', NULL, 0, 0),
(220, 8, '2026-09-03', NULL, NULL, 0.00, 0.00, 'Presente', NULL, 0, 0),
(221, 8, '2026-09-04', NULL, NULL, 0.00, 0.00, 'Presente', NULL, 0, 0),
(222, 8, '2026-09-05', NULL, NULL, 0.00, 0.00, 'Presente', NULL, 0, 0),
(223, 8, '2026-09-07', NULL, NULL, 0.00, 0.00, 'Presente', NULL, 0, 0),
(224, 8, '2026-09-08', NULL, NULL, 0.00, 0.00, 'Presente', NULL, 0, 0),
(225, 8, '2026-09-09', NULL, NULL, 0.00, 0.00, 'Presente', NULL, 0, 0),
(226, 8, '2026-09-10', NULL, NULL, 0.00, 0.00, 'Presente', NULL, 0, 0),
(227, 8, '2026-09-11', NULL, NULL, 0.00, 0.00, 'Presente', NULL, 0, 0),
(228, 8, '2026-09-12', NULL, NULL, 0.00, 0.00, 'Presente', NULL, 0, 0),
(229, 8, '2026-09-14', NULL, NULL, 0.00, 0.00, 'Presente', NULL, 0, 0),
(230, 8, '2026-09-15', NULL, NULL, 0.00, 0.00, 'Presente', NULL, 0, 0),
(231, 8, '2026-09-16', NULL, NULL, 0.00, 0.00, 'Presente', NULL, 0, 0),
(232, 8, '2026-09-17', NULL, NULL, 0.00, 0.00, 'Presente', NULL, 0, 0),
(233, 8, '2026-09-18', NULL, NULL, 0.00, 0.00, 'Presente', NULL, 0, 0),
(234, 8, '2026-09-19', NULL, NULL, 0.00, 0.00, 'Presente', NULL, 0, 0),
(235, 8, '2026-09-21', NULL, NULL, 0.00, 0.00, 'Presente', NULL, 0, 0),
(236, 8, '2026-09-22', NULL, NULL, 0.00, 0.00, 'Presente', NULL, 0, 0),
(237, 8, '2026-09-23', NULL, NULL, 0.00, 0.00, 'Presente', NULL, 0, 0),
(238, 8, '2026-09-24', NULL, NULL, 0.00, 0.00, 'Presente', NULL, 0, 0),
(239, 8, '2026-09-25', NULL, NULL, 0.00, 0.00, 'Presente', NULL, 0, 0),
(240, 8, '2026-09-26', NULL, NULL, 0.00, 0.00, 'Presente', NULL, 0, 0),
(241, 8, '2026-09-28', NULL, NULL, 0.00, 0.00, 'Presente', NULL, 0, 0),
(242, 8, '2026-09-29', NULL, NULL, 0.00, 0.00, 'Presente', NULL, 0, 0),
(243, 8, '2026-09-30', NULL, NULL, 0.00, 0.00, 'Presente', NULL, 0, 0),
(244, 2, '2026-09-01', NULL, NULL, 0.00, 0.00, 'Presente', NULL, 0, 0),
(245, 2, '2026-09-02', NULL, NULL, 0.00, 0.00, 'Presente', NULL, 0, 0),
(246, 2, '2026-09-03', NULL, NULL, 0.00, 0.00, 'Presente', NULL, 0, 0),
(247, 2, '2026-09-04', NULL, NULL, 0.00, 0.00, 'Presente', NULL, 0, 0),
(248, 2, '2026-09-05', NULL, NULL, 0.00, 0.00, 'Presente', NULL, 0, 0),
(256, 2, '2026-09-15', NULL, NULL, 0.00, 0.00, 'Presente', NULL, 0, 0),
(257, 2, '2026-09-16', NULL, NULL, 0.00, 0.00, 'Presente', NULL, 0, 0),
(258, 2, '2026-09-17', NULL, NULL, 0.00, 0.00, 'Presente', NULL, 0, 0),
(259, 2, '2026-09-18', NULL, NULL, 0.00, 0.00, 'Presente', NULL, 0, 0),
(270, 13, '2026-09-01', NULL, NULL, 8.00, 0.00, 'Presente', NULL, 480, 0),
(271, 13, '2026-09-02', NULL, NULL, 8.00, 0.00, 'Presente', NULL, 480, 0),
(272, 13, '2026-09-03', NULL, NULL, 8.00, 0.00, 'Presente', NULL, 480, 0),
(273, 13, '2026-09-04', NULL, NULL, 8.00, 0.00, 'Presente', NULL, 480, 0),
(274, 13, '2026-09-05', NULL, NULL, 0.00, 8.00, 'Presente', NULL, 0, 480),
(275, 13, '2026-09-07', NULL, NULL, 8.00, 0.00, 'Presente', NULL, 480, 0),
(276, 13, '2026-09-08', NULL, NULL, 8.00, 0.00, 'Presente', NULL, 480, 0),
(277, 13, '2026-09-09', NULL, NULL, 8.00, 0.00, 'Presente', NULL, 480, 0),
(278, 13, '2026-09-10', NULL, NULL, 8.00, 0.00, 'Presente', NULL, 480, 0),
(279, 13, '2026-09-11', NULL, NULL, 8.00, 0.00, 'Presente', NULL, 480, 0),
(280, 13, '2026-09-12', NULL, NULL, 0.00, 4.00, 'Presente', NULL, 0, 240),
(281, 13, '2026-09-14', NULL, NULL, 8.00, 0.00, 'Presente', NULL, 480, 0),
(282, 13, '2026-09-15', NULL, NULL, 8.00, 0.00, 'Presente', NULL, 480, 0),
(283, 13, '2026-09-16', NULL, NULL, 8.00, 0.00, 'Presente', NULL, 480, 0),
(284, 13, '2026-09-17', NULL, NULL, 8.00, 0.00, 'Presente', NULL, 480, 0),
(285, 13, '2026-09-18', NULL, NULL, 8.00, 0.00, 'Presente', NULL, 480, 0),
(286, 13, '2026-09-21', NULL, NULL, 8.00, 0.00, 'Presente', NULL, 480, 0),
(287, 13, '2026-09-22', NULL, NULL, 8.00, 0.00, 'Presente', NULL, 480, 0),
(288, 13, '2026-09-23', NULL, NULL, 8.00, 0.00, 'Presente', NULL, 480, 0),
(289, 13, '2026-09-25', NULL, NULL, 8.00, 0.00, 'Presente', NULL, 480, 0),
(290, 13, '2026-09-26', NULL, NULL, 0.00, 8.00, 'Presente', NULL, 0, 480),
(291, 13, '2026-09-28', NULL, NULL, 8.00, 0.00, 'Presente', NULL, 480, 0),
(292, 13, '2026-09-29', NULL, NULL, 8.00, 0.00, 'Presente', NULL, 480, 0),
(293, 13, '2026-09-30', NULL, NULL, 8.00, 0.00, 'Presente', NULL, 480, 0);

-- --------------------------------------------------------

--
-- Table structure for table `concepto_nomina`
--

CREATE TABLE `concepto_nomina` (
  `id_concepto` int(11) NOT NULL,
  `nombre` varchar(100) DEFAULT NULL,
  `tipo` varchar(20) DEFAULT NULL,
  `metodo_calculo` varchar(30) DEFAULT NULL,
  `descripcion` varchar(255) DEFAULT NULL,
  `estado` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `concepto_nomina`
--

INSERT INTO `concepto_nomina` (`id_concepto`, `nombre`, `tipo`, `metodo_calculo`, `descripcion`, `estado`) VALUES
(1, 'Incentivo', 'INGRESO', 'MONTO', 'Pago adicional otorgado al empleado', 'Activo'),
(2, 'Vacaciones', 'INGRESO', 'MONTO', 'Pago correspondiente a vacaciones', 'Activo'),
(3, 'AFP', 'DEDUCCION', 'PORCENTAJE', 'Aporte del empleado al fondo de pensiones', 'Activo'),
(4, 'SFS', 'DEDUCCION', 'PORCENTAJE', 'Aporte del empleado al Seguro Familiar de Salud', 'Activo'),
(5, 'ISR', 'DEDUCCION', 'ESCALA', 'Impuesto Sobre la Renta', 'Activo'),
(6, 'Otros descuentos', 'DEDUCCION', 'MONTO', 'Otros descuentos aplicados al empleado', 'Activo');

-- --------------------------------------------------------

--
-- Table structure for table `configuracion_asistencia`
--

CREATE TABLE `configuracion_asistencia` (
  `id_configuracion` tinyint(4) NOT NULL,
  `domingo_habilitado` tinyint(1) NOT NULL DEFAULT 0,
  `fecha_actualizacion` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ;

--
-- Dumping data for table `configuracion_asistencia`
--

INSERT INTO `configuracion_asistencia` (`id_configuracion`, `domingo_habilitado`, `fecha_actualizacion`) VALUES
(1, 0, '2026-10-06 11:18:33');

-- --------------------------------------------------------

--
-- Table structure for table `detalle_concepto`
--

CREATE TABLE `detalle_concepto` (
  `id_detalle_concepto` int(11) NOT NULL,
  `id_detalle` int(11) NOT NULL,
  `id_concepto` int(11) NOT NULL,
  `cantidad` decimal(14,2) DEFAULT NULL,
  `monto` decimal(14,2) NOT NULL,
  `descripcion` varchar(255) DEFAULT NULL,
  `base_calculo` decimal(14,2) DEFAULT NULL,
  `tasa_aplicada` decimal(6,4) DEFAULT NULL,
  `anio_calculo` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `detalle_nomina`
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

--
-- Dumping data for table `detalle_nomina`
--

INSERT INTO `detalle_nomina` (`id_detalle`, `id_nomina`, `id_empleado`, `salario_bruto`, `total_ingresos`, `total_deducciones`, `salario_neto`) VALUES
(6, 1, 13, 11350.00, 11350.00, 0.00, 11350.00),
(7, 2, 13, 6000.00, 6000.00, 0.00, 6000.00);

-- --------------------------------------------------------

--
-- Table structure for table `empleados`
--

CREATE TABLE `empleados` (
  `id_empleado` int(11) NOT NULL,
  `numero_empleado` int(11) DEFAULT NULL,
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
  `estado` enum('Activo','Inactivo','Suspendido','Licencia','Vacaciones') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `empleados`
--

INSERT INTO `empleados` (`id_empleado`, `numero_empleado`, `nombres`, `apellidos`, `cedula`, `sexo`, `fecha_nacimiento`, `telefono`, `correo`, `direccion`, `fecha_ingreso`, `salario_base`, `id_puesto`, `estado`) VALUES
(2, 1, 'Brauly', 'Parra', '038-0000000', 'Masculino', '2026-06-01', '555-999-8888', 'brauly@gmail.com', 'Aquí, Allá, Alrededor', '2026-08-01', 300.00, 3, 'Activo'),
(7, 5, 'Sammy', 'Sosa', '111-1111111', 'Masculino', '1973-02-15', '829-999-9999', 'Sosa@none.com', 'Arriba, Abajo, Alla', '2026-08-01', 500.05, 1, 'Licencia'),
(8, 6, 'Maria', 'Montana', '987-6543233', 'Femenino', '1999-03-11', '999-999-4444', 'maria@none.com', 'Arriba, Abajo, Alla', '2026-06-02', 365.00, 1, 'Suspendido'),
(9, 7, 'Nuevo ', 'Yo', '038-0048930', 'Femenino', '1988-08-26', '415-632-8957', 'none@mateo.com', 'Alante, detrás, Al Lado', '2026-02-01', 265.93, 1, 'Inactivo'),
(10, 8, 'Leonel ', 'Fernandez', '305-6937815', 'Masculino', '1983-10-09', '809-654-8523', 'pld@nones.com', 'Palacio Nacional, #5', '2026-02-25', 3020.00, 1, 'Vacaciones'),
(11, 9, 'Brauly', 'Admin', '00000000000', 'Masculino', '2000-09-19', '987-654-3210', 'braulyadmin@gmail.com', 'Arriba, Abajo, Alla', '2026-09-01', 400.00, 1, 'Activo'),
(12, 10, 'Leopoldo', 'Mariano', '12345678901', 'Masculino', '1981-09-17', '829-645-3278', 'leo.mar@hotmail.com', 'El Batey Arriba', '2023-06-08', 400.00, 1, 'Activo'),
(13, 11, 'Uasd', 'Monográfico', '39888175361', 'Masculino', '1990-02-21', '863-250-6325', 'uasd@gmail.com', 'Adelante, Me equivoqué #6', '2026-08-06', 250.00, 5, 'Activo');

-- --------------------------------------------------------

--
-- Table structure for table `historial_salario`
--

CREATE TABLE `historial_salario` (
  `id_historial` int(11) NOT NULL,
  `id_empleado` int(11) NOT NULL,
  `fecha_inicio` date DEFAULT NULL,
  `salario` decimal(14,2) DEFAULT NULL,
  `motivo_cambio` varchar(255) DEFAULT NULL,
  `registrado_por` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `historial_salario`
--

INSERT INTO `historial_salario` (`id_historial`, `id_empleado`, `fecha_inicio`, `salario`, `motivo_cambio`, `registrado_por`) VALUES
(1, 2, '2026-08-25', 250.00, 'Tarifa inicial confirmada para el inicio del control', NULL),
(2, 7, '2026-08-25', 500.05, 'Tarifa inicial confirmada para el inicio del control', NULL),
(3, 8, '2026-08-25', 365.00, 'Tarifa inicial confirmada para el inicio del control', NULL),
(4, 9, '2026-08-25', 265.93, 'Tarifa inicial confirmada para el inicio del control', NULL),
(5, 10, '2026-08-25', 3020.00, 'Tarifa inicial confirmada para el inicio del control', NULL),
(6, 2, '2026-09-09', 300.00, 'Aumento Anual', NULL),
(7, 11, '2026-09-01', 400.00, 'Tarifa inicial al registrar el empleado', NULL),
(8, 12, '2026-09-03', 400.00, 'Tarifa inicial al registrar el empleado', NULL),
(9, 13, '2026-09-01', 250.00, 'Tarifa inicial al registrar el empleado', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `incentivos`
--

CREATE TABLE `incentivos` (
  `id_incentivo` int(11) NOT NULL,
  `id_empleado` int(11) NOT NULL,
  `id_nomina` int(11) NOT NULL,
  `monto` decimal(14,2) NOT NULL,
  `descripcion` varchar(255) DEFAULT NULL,
  `fecha_registro` datetime NOT NULL DEFAULT current_timestamp(),
  `id_detalle_concepto_origen` int(11) DEFAULT NULL
) ;

--
-- Dumping data for table `incentivos`
--

INSERT INTO `incentivos` (`id_incentivo`, `id_empleado`, `id_nomina`, `monto`, `descripcion`, `fecha_registro`, `id_detalle_concepto_origen`) VALUES
(3, 13, 3, 1000.00, 'Bono de métricas.', '2026-10-08 17:58:38', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `nomina`
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

--
-- Dumping data for table `nomina`
--

INSERT INTO `nomina` (`id_nomina`, `periodo_inicio`, `periodo_fin`, `fecha_pago`, `anio`, `estado`, `total_bruto`, `total_deducciones`, `total_neto`) VALUES
(1, '2026-09-07', '2026-09-13', '2026-09-18', 2026, 'Procesada', 11350.00, 0.00, 11350.00),
(2, '2026-09-28', '2026-10-04', '2026-10-09', 2026, 'Procesada', 6000.00, 0.00, 6000.00),
(3, '2026-09-28', '2026-10-04', '2026-10-09', 2026, 'Borrador', NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `nomina_calculo_guardado`
--

CREATE TABLE `nomina_calculo_guardado` (
  `id_nomina` int(11) NOT NULL,
  `resultado` longtext NOT NULL,
  `fecha_calculo` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `nomina_calculo_guardado`
--

INSERT INTO `nomina_calculo_guardado` (`id_nomina`, `resultado`, `fecha_calculo`) VALUES
(1, '{\"id_nomina\":1,\"dias\":[{\"id_empleado\":13,\"numero_empleado\":11,\"nombres\":\"Uasd\",\"apellidos\":\"Monográfico\",\"fecha\":\"2026-09-07\",\"minutos_regulares\":480,\"minutos_extras\":0,\"tarifa_hora\":\"250.00\",\"tarifa_desde\":\"2026-09-01\",\"semana_inicio\":\"2026-09-07\",\"minutos_normales\":480,\"minutos_extras_35\":0,\"minutos_extras_100\":0,\"minutos_excedentes\":0,\"importe_normal\":\"2000.00\",\"importe_excedente\":\"0.00\"},{\"id_empleado\":13,\"numero_empleado\":11,\"nombres\":\"Uasd\",\"apellidos\":\"Monográfico\",\"fecha\":\"2026-09-08\",\"minutos_regulares\":480,\"minutos_extras\":0,\"tarifa_hora\":\"250.00\",\"tarifa_desde\":\"2026-09-01\",\"semana_inicio\":\"2026-09-07\",\"minutos_normales\":480,\"minutos_extras_35\":0,\"minutos_extras_100\":0,\"minutos_excedentes\":0,\"importe_normal\":\"2000.00\",\"importe_excedente\":\"0.00\"},{\"id_empleado\":13,\"numero_empleado\":11,\"nombres\":\"Uasd\",\"apellidos\":\"Monográfico\",\"fecha\":\"2026-09-09\",\"minutos_regulares\":480,\"minutos_extras\":0,\"tarifa_hora\":\"250.00\",\"tarifa_desde\":\"2026-09-01\",\"semana_inicio\":\"2026-09-07\",\"minutos_normales\":480,\"minutos_extras_35\":0,\"minutos_extras_100\":0,\"minutos_excedentes\":0,\"importe_normal\":\"2000.00\",\"importe_excedente\":\"0.00\"},{\"id_empleado\":13,\"numero_empleado\":11,\"nombres\":\"Uasd\",\"apellidos\":\"Monográfico\",\"fecha\":\"2026-09-10\",\"minutos_regulares\":480,\"minutos_extras\":0,\"tarifa_hora\":\"250.00\",\"tarifa_desde\":\"2026-09-01\",\"semana_inicio\":\"2026-09-07\",\"minutos_normales\":480,\"minutos_extras_35\":0,\"minutos_extras_100\":0,\"minutos_excedentes\":0,\"importe_normal\":\"2000.00\",\"importe_excedente\":\"0.00\"},{\"id_empleado\":13,\"numero_empleado\":11,\"nombres\":\"Uasd\",\"apellidos\":\"Monográfico\",\"fecha\":\"2026-09-11\",\"minutos_regulares\":480,\"minutos_extras\":0,\"tarifa_hora\":\"250.00\",\"tarifa_desde\":\"2026-09-01\",\"semana_inicio\":\"2026-09-07\",\"minutos_normales\":480,\"minutos_extras_35\":0,\"minutos_extras_100\":0,\"minutos_excedentes\":0,\"importe_normal\":\"2000.00\",\"importe_excedente\":\"0.00\"},{\"id_empleado\":13,\"numero_empleado\":11,\"nombres\":\"Uasd\",\"apellidos\":\"Monográfico\",\"fecha\":\"2026-09-12\",\"minutos_regulares\":0,\"minutos_extras\":240,\"tarifa_hora\":\"250.00\",\"tarifa_desde\":\"2026-09-01\",\"semana_inicio\":\"2026-09-07\",\"minutos_normales\":0,\"minutos_extras_35\":240,\"minutos_extras_100\":0,\"minutos_excedentes\":240,\"importe_normal\":\"0.00\",\"importe_excedente\":\"1350.00\"}],\"pendientes\":[],\"limite_semanal_minutos\":2400,\"limite_diario_minutos\":480,\"umbral_recargo_100_minutos\":4080,\"recargo_extra_porcentaje\":35,\"recargo_extra_superior_porcentaje\":100,\"regla_horas\":\"ordinaria_40_8_recargos_35_100_v1\",\"total_normal\":\"10000.00\",\"minutos_normales\":2400,\"minutos_excedentes\":240,\"minutos_extras_35\":240,\"minutos_extras_100\":0,\"alcance\":\"Resultados guardados; los incentivos se presentan por separado.\",\"empleados\":[{\"id_empleado\":13,\"nombre\":\"Uasd Monográfico\",\"minutos_normales\":2400,\"minutos_excedentes\":240,\"minutos_extras_35\":240,\"minutos_extras_100\":0,\"importe_normal\":\"10000.00\",\"importe_excedente\":\"1350.00\",\"bruto\":\"11350.00\"}],\"incentivos_aparte\":[],\"total_incentivos_aparte\":\"0.00\",\"subtotal_nomina\":\"10000.00\",\"tratamiento_incentivos\":\"separados_provisionalmente\",\"acumulados\":[{\"id_empleado\":13,\"nombre\":\"Uasd Monográfico\",\"minutos_normales\":4320,\"minutos_excedentes\":720,\"minutos_extras_35\":720,\"minutos_extras_100\":0,\"importe_normal\":\"18000.00\",\"importe_excedente\":\"4050.00\",\"bruto\":\"22050.00\",\"mes\":\"2026-09\",\"hasta\":\"2026-09-13\",\"fecha_descuento\":\"2026-10-02\",\"afp\":\"632.84\",\"sfs\":\"670.32\",\"isr\":\"0.00\",\"base_isr\":\"20746.84\",\"total\":\"1303.16\",\"tasa_aplicada\":{\"id_tasa\":1,\"vigente_desde\":\"2026-02-01\",\"parametros\":{\"afp\":\"2.87\",\"sfs\":\"3.04\",\"tope_afp\":\"464460.00\",\"tope_sfs\":\"232230.00\",\"exento\":\"416220.00\",\"limite1\":\"624329.00\",\"limite2\":\"867123.00\",\"tasa1\":\"15.00\",\"tasa2\":\"20.00\",\"tasa3\":\"25.00\",\"cuota2\":\"31216.00\",\"cuota3\":\"79776.00\"}}}],\"pagos\":[{\"id_empleado\":13,\"nombre\":\"Uasd Monográfico\",\"minutos_normales\":2400,\"minutos_excedentes\":240,\"minutos_extras_35\":240,\"minutos_extras_100\":0,\"importe_normal\":\"10000.00\",\"importe_excedente\":\"1350.00\",\"bruto\":\"11350.00\",\"afp\":\"0.00\",\"sfs\":\"0.00\",\"isr\":\"0.00\",\"deducciones\":\"0.00\",\"neto\":\"11350.00\",\"sueldo_insuficiente\":false,\"saldo_pendiente\":\"0.00\",\"neto_registrado\":\"11350.00\"}],\"mes_descuento\":null,\"vista_previa\":false,\"guardado\":true,\"totales_guardados\":{\"bruto\":\"11350.00\",\"deducciones\":\"0.00\",\"neto\":\"11350.00\"}}', '2026-10-08 17:33:44'),
(2, '{\"id_nomina\":2,\"dias\":[{\"id_empleado\":13,\"numero_empleado\":11,\"nombres\":\"Uasd\",\"apellidos\":\"Monográfico\",\"fecha\":\"2026-09-28\",\"minutos_regulares\":480,\"minutos_extras\":0,\"tarifa_hora\":\"250.00\",\"tarifa_desde\":\"2026-09-01\",\"semana_inicio\":\"2026-09-28\",\"minutos_normales\":480,\"minutos_extras_35\":0,\"minutos_extras_100\":0,\"minutos_excedentes\":0,\"importe_normal\":\"2000.00\",\"importe_excedente\":\"0.00\"},{\"id_empleado\":13,\"numero_empleado\":11,\"nombres\":\"Uasd\",\"apellidos\":\"Monográfico\",\"fecha\":\"2026-09-29\",\"minutos_regulares\":480,\"minutos_extras\":0,\"tarifa_hora\":\"250.00\",\"tarifa_desde\":\"2026-09-01\",\"semana_inicio\":\"2026-09-28\",\"minutos_normales\":480,\"minutos_extras_35\":0,\"minutos_extras_100\":0,\"minutos_excedentes\":0,\"importe_normal\":\"2000.00\",\"importe_excedente\":\"0.00\"},{\"id_empleado\":13,\"numero_empleado\":11,\"nombres\":\"Uasd\",\"apellidos\":\"Monográfico\",\"fecha\":\"2026-09-30\",\"minutos_regulares\":480,\"minutos_extras\":0,\"tarifa_hora\":\"250.00\",\"tarifa_desde\":\"2026-09-01\",\"semana_inicio\":\"2026-09-28\",\"minutos_normales\":480,\"minutos_extras_35\":0,\"minutos_extras_100\":0,\"minutos_excedentes\":0,\"importe_normal\":\"2000.00\",\"importe_excedente\":\"0.00\"}],\"pendientes\":[],\"limite_semanal_minutos\":2400,\"limite_diario_minutos\":480,\"umbral_recargo_100_minutos\":4080,\"recargo_extra_porcentaje\":35,\"recargo_extra_superior_porcentaje\":100,\"regla_horas\":\"ordinaria_40_8_recargos_35_100_v1\",\"total_normal\":\"6000.00\",\"minutos_normales\":1440,\"minutos_excedentes\":0,\"minutos_extras_35\":0,\"minutos_extras_100\":0,\"alcance\":\"Resultados guardados; los incentivos se presentan por separado.\",\"empleados\":[{\"id_empleado\":13,\"nombre\":\"Uasd Monográfico\",\"minutos_normales\":1440,\"minutos_excedentes\":0,\"minutos_extras_35\":0,\"minutos_extras_100\":0,\"importe_normal\":\"6000.00\",\"importe_excedente\":\"0.00\",\"bruto\":\"6000.00\"}],\"incentivos_aparte\":[],\"total_incentivos_aparte\":\"0.00\",\"subtotal_nomina\":\"6000.00\",\"tratamiento_incentivos\":\"separados_provisionalmente\",\"acumulados\":[{\"id_empleado\":13,\"nombre\":\"Uasd Monográfico\",\"minutos_normales\":10080,\"minutos_excedentes\":1200,\"minutos_extras_35\":1200,\"minutos_extras_100\":0,\"importe_normal\":\"42000.00\",\"importe_excedente\":\"6750.00\",\"bruto\":\"48750.00\",\"mes\":\"2026-09\",\"hasta\":\"2026-09-30\",\"fecha_descuento\":\"2026-10-02\",\"afp\":\"1399.13\",\"sfs\":\"1482.00\",\"isr\":\"1677.58\",\"base_isr\":\"45868.87\",\"total\":\"4558.71\",\"tasa_aplicada\":{\"id_tasa\":1,\"vigente_desde\":\"2026-02-01\",\"parametros\":{\"afp\":\"2.87\",\"sfs\":\"3.04\",\"tope_afp\":\"464460.00\",\"tope_sfs\":\"232230.00\",\"exento\":\"416220.00\",\"limite1\":\"624329.00\",\"limite2\":\"867123.00\",\"tasa1\":\"15.00\",\"tasa2\":\"20.00\",\"tasa3\":\"25.00\",\"cuota2\":\"31216.00\",\"cuota3\":\"79776.00\"}}}],\"pagos\":[{\"id_empleado\":13,\"nombre\":\"Uasd Monográfico\",\"minutos_normales\":1440,\"minutos_excedentes\":0,\"minutos_extras_35\":0,\"minutos_extras_100\":0,\"importe_normal\":\"6000.00\",\"importe_excedente\":\"0.00\",\"bruto\":\"6000.00\",\"afp\":\"0.00\",\"sfs\":\"0.00\",\"isr\":\"0.00\",\"deducciones\":\"0.00\",\"neto\":\"6000.00\",\"sueldo_insuficiente\":false,\"saldo_pendiente\":\"0.00\",\"neto_registrado\":\"6000.00\"}],\"mes_descuento\":null,\"vista_previa\":false,\"guardado\":true,\"totales_guardados\":{\"bruto\":\"6000.00\",\"deducciones\":\"0.00\",\"neto\":\"6000.00\"}}', '2026-10-08 17:36:58');

-- --------------------------------------------------------

--
-- Table structure for table `puestos`
--

CREATE TABLE `puestos` (
  `id_puesto` int(11) NOT NULL,
  `nombre_puesto` varchar(100) NOT NULL,
  `descripcion` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `puestos`
--

INSERT INTO `puestos` (`id_puesto`, `nombre_puesto`, `descripcion`) VALUES
(1, 'Soporte', 'Soporte técnico'),
(2, 'Agente de servicio al cliente', 'Atiende consultas, solicitudes y problemas de los clientes, ofreciendo orientación y soluciones.'),
(3, 'Backoffice', 'Boarding'),
(5, 'Asistente del administrador', 'Asistir con las tareas que el administrador asigne a este puesto.'),
(6, 'Especialista en Contracargos (Chargebacks)', 'Especialista en documentar y responder a las notificaciones de contracargo de las pasarelas de pago dentro de los plazos establecidos.');

-- --------------------------------------------------------

--
-- Table structure for table `rol`
--

CREATE TABLE `rol` (
  `id_rol` int(11) NOT NULL,
  `nombre` varchar(50) NOT NULL,
  `descripcion` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `rol`
--

INSERT INTO `rol` (`id_rol`, `nombre`, `descripcion`) VALUES
(1, 'admin', ''),
(2, 'manager', ''),
(3, 'viewer', '');

-- --------------------------------------------------------

--
-- Table structure for table `tasas_descuentos`
--

CREATE TABLE `tasas_descuentos` (
  `id_tasa` int(10) UNSIGNED NOT NULL,
  `vigente_desde` date NOT NULL,
  `parametros` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`parametros`)),
  `motivo` varchar(250) NOT NULL,
  `creado_por` varchar(50) NOT NULL,
  `creado_en` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tasas_descuentos`
--

INSERT INTO `tasas_descuentos` (`id_tasa`, `vigente_desde`, `parametros`, `motivo`, `creado_por`, `creado_en`) VALUES
(1, '2026-02-01', '{\"afp\":\"2.87\",\"sfs\":\"3.04\",\"tope_afp\":\"464460.00\",\"tope_sfs\":\"232230.00\",\"exento\":\"416220.00\",\"limite1\":\"624329.00\",\"limite2\":\"867123.00\",\"tasa1\":\"15.00\",\"tasa2\":\"20.00\",\"tasa3\":\"25.00\",\"cuota2\":\"31216.00\",\"cuota3\":\"79776.00\"}', 'Valores existentes del proyecto antes del historial de tasas', 'Sistema', '2026-09-28 03:24:30'),
(2, '2026-11-01', '{\"afp\":\"2.87\",\"sfs\":\"3.04\",\"tope_afp\":\"464460.00\",\"tope_sfs\":\"232230.00\",\"exento\":\"416220.00\",\"limite1\":\"624329.00\",\"limite2\":\"867123.00\",\"tasa1\":\"15.00\",\"tasa2\":\"20.00\",\"tasa3\":\"25.00\",\"cuota2\":\"31216.00\",\"cuota3\":\"79776.00\"}', 'Prueba', 'brauly_admin', '2026-10-06 16:18:01'),
(3, '2026-12-01', '{\"afp\":\"2.87\",\"sfs\":\"3.04\",\"tope_afp\":\"464460.00\",\"tope_sfs\":\"232230.00\",\"exento\":\"416220.00\",\"limite1\":\"624329.00\",\"limite2\":\"867123.00\",\"tasa1\":\"15.00\",\"tasa2\":\"20.00\",\"tasa3\":\"25.00\",\"cuota2\":\"31216.00\",\"cuota3\":\"79776.00\"}', 'Prueba para desactivar el Domingo en asistencias', 'brauly_admin', '2026-10-06 16:18:56');

-- --------------------------------------------------------

--
-- Table structure for table `usuarios`
--

CREATE TABLE `usuarios` (
  `id_usuario` int(11) NOT NULL,
  `id_empleado` int(11) DEFAULT NULL,
  `id_rol` int(11) NOT NULL,
  `usuario` varchar(50) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `estado` varchar(20) DEFAULT NULL,
  `ultimo_acceso` datetime DEFAULT NULL,
  `intentos_fallidos` int(11) DEFAULT 0,
  `bloqueado_hasta` datetime DEFAULT NULL,
  `foto_perfil` mediumtext DEFAULT NULL,
  `permisos_personales` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`permisos_personales`))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `usuarios`
--

INSERT INTO `usuarios` (`id_usuario`, `id_empleado`, `id_rol`, `usuario`, `password_hash`, `estado`, `ultimo_acceso`, `intentos_fallidos`, `bloqueado_hasta`, `foto_perfil`, `permisos_personales`) VALUES
(1, 2, 1, 'Test', 'scrypt$8ac5d661c4e8b68c8b39721be1da8a5c$4aca0b216f367884d508e8bcc0e1cdd61dc148627a40b225bd16630960d0a404da69c6bdf065438a65a6a876c1c8b9f6704208c964f9e0ee4c2b810c727b0c0f', 'Activo', '2026-09-27 19:21:03', 0, NULL, 'data:image/jpeg;base64,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', NULL),
(3, 11, 1, 'brauly_admin', 'scrypt$eed924883d11a4a1087caabb02dbedb5$610f1aea07bd6502d6049447a20680293f2474a6ee3f2ac896809b5fc47ae776d95ce23a604c3afa28fe046431dd52944d1a00b7f1e9367d636bfa30d45c9d11', 'Activo', '2026-10-08 23:44:44', 0, NULL, 'data:image/jpeg;base64,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', NULL),
(5, 12, 3, 'Leo_Mar', 'scrypt$095c8db8f614691899a239b81c9bc4d2$99e005e651de1ad37a985e44142bc2f4884b76be6da23dfce3f193988fcd2d71d602b34a4fb15b2ca9dfa00e560c6e472587fb2ca2a07e57539e7a85921eff12', 'Activo', '2026-09-17 13:59:22', 0, NULL, 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCADAAMADASIAAhEBAxEB/8QAHQABAAICAwEBAAAAAAAAAAAAAAcIBQYBAgQDCf/EAEIQAAEDAwMCBAUCAgYIBwEAAAECAwQABREGByESMRNBUWEIFCJxgTKRFUIXI5KhscEWQ1JiY4KjwhgmM1Nyk7LR/8QAGQEBAAMBAQAAAAAAAAAAAAAAAAECAwUE/8QAIxEBAQACAgICAgMBAAAAAAAAAAECEQMSBCExQRMiBVFhcf/aAAwDAQACEQMRAD8AtTSlKBSlKBSlKBSlKBSlaJvPqq96Q0RIuOmrQ5c5/UGx0pK0sAg/1ikjkgY7DzIzxQbLqjUdp0tZ3bpf5zUKE13cXk5PoAMkn2AJqI5nxPaBYcKWk3iSkfztxQAf7Sgf7qrnatZ2m/3tU/eGZqC8LZUQxCZwlpvPckdQx9kgduTUw6X3C2KT0MpsMS38dPXMtQc/dQCz+9YcvNcPjG1Mjc7V8S23059Lb71ygBRx1yYuUj79BUf7qlqyXu2X22ouFnnR5kJfZ5lYUn8+lRxE0ltXrWMVWy16bmpUOVQUIQsffowR+a0jVWy110rGuNx2mvU2C4+ypMi1uudSH04PCSfPBOOrPPmKyx8zC3WU0nr/AEjLdTd2+3Lc83rTsuYnT9hlNstBlSgy7hRyV44PX0qxn+UVcvTt3i36xQLrb3A5FmMpebUDnhQzj7jsftVeNlNsjcdibzab9DcjSby846jxkFK2ykANKweeFJJ+xPrWO+HfcqFobTmo9Na1k/JLsbq3WUL/AFKBUQttA81dfIH+8T2FbcXPjyZZYz6RZpailVo273+vGt93YFnZhxYNgkFxKGykreVhCiCpecZyOwHtz3qy9bIKUpQKUpQKUpQKUpQKUpQKUpQKUpQK81wnw7dFXIuMpiLHQMqdfcCED7k8VEm9G9cbRMv+A2GKbpqh3pCWAklDJV+nqxypR4wkevetBtGzusdxpwvW7N8lMNLwpu2sqHUkemB9DY9gCT581FujTbNcbx7R+I5HuEaLqFxOUkN29LyfwtYAP3BNQ9qW+7XaibWm2bb3+OtXZ+34aI9wkdSf7qsxpPa3RmlGUi02GH4w7yJCPGdJ9epeSPxgVuTaG20BLSEIA8kjFV7rTF+agh3iz3D5qBHu0Itr6mXi2tpxIzwcjsfsanfaT4jJ8GS1a9fKMqGrCE3BKP61o/8AEA/UPfv96tqoJWClaQoe4zUXbw6c0NJt8dq/afbmXSc6WYLUBsNy3ncZwlaccDuSr6QO9Z8mOHLNZxOrElxpLEuK1IjOtvMOpC23G1BSVJPYgjuKjTcDZHS2t9SNXu4/Nx5f0h8RlpSmQBwOrIPOABkY4r77FaSvmjtJO26/yULQX1ORYoX4pitn+QuYHUfsMDn14kn0rgd7w8l/HWmtz2rNrq2w9J/Ent0m2Rm4kFTTEVtttOEgFa0f94q01Ve+LnrtV80NqJoHqiSV5PuhTa0/4Kqz7TiXWkOIOUrAUD6g13vFz78UtY5TVdqUpXoQUpSgUpSgUpSgUpSgUpSgVq24OvLDoK0ibqCYlkuZDDKfqceUPJKR+OewzWzuqKG1KSkrIBISO59q/Ovc69aqvGuHr7qi2y4shT5THjy46vDaCTlLaQoYUBxn17nvQSz8Ol2tmo92L9qnU0+KzeZzhTAivHBWpZOQgnjKUhKQBzzVtB2qEv6NNaXuzw7fetax/wCDKDTjkVm0MNuIIwrpQpIHTg+YxU0tDoQlBUVdIxk9zWPa35aYx5rxc4dotsm4XJ9EeHGQXHXVnhKR3NaBL3Guxt5u1t0fIXYko8QzbhcGYWUeSwheTg+XURmts1rpiFrHTcux3NyQ3EldPiKYUErwFBXBII8vStd0/tbZbe1i9PzdRvJVlly7u+MGU9glKP0DHrjP+FRd/Sf+M9oPWFr1vYEXayLUpgrLTiF46mnBjKVYJGeQcg4IINd9U6Rs+p/ll3RhwyYpUqNJYeWy8wVDBKFpIIzge1ZiLGjxGEMw2GmGU9kNICEj7AcV9cd6J169tINg1dZmSbFqRN1bQPpi3toEkenjtgKz7qSqvpojXkbUd1uNkkxVwb/bQPnIoWHm0eWUup4P2OFe1NTzJV9vJ0tZpL0VKG0vXSazwplpX6WkK8nF4PPdKcnuRWe0/YrXp+D8nZYLENjOSlpOCo+qj3Ufc81yvOvDj+uv2J/iB/jSL3+iunUoZUpj5xwrdA4Sro+lOfcFX9mpE2u3f0dfbJZ7eb2wxdhHaZWxKy0VOBIBCSrhXPoakGXFYmMKZlsNSGVd23UBaT9weKpZu5b7lrbecaTstggWp9hZjx2kISz4qcdRdWoAZBTyMeXbJrf+N8jtPxa+Fc59r0UrXtvrDJ0xo21WadPcuEmIyG1yFkkqOScDPOBnAz5AVsNdVmUpSgUpSgUpSgUpSgUpSg4WpKElSyEpAySTgAVUb4n9d2XWFzsNi0oty73CDLUtfyzZW2okAdCSP1HjyGPets+KbXVwM63bfaZeKJ906BLUhWD0LPShrPl1dz7Y8jUh7ObTWbbq1tqQ23KvriMSZ6hzk90oz+lP+PnQY0a/1hGhoky9sL0mL05JZlMuOAY/9sHq/FGt6LFcLS7/AAmNMc1J4iYzVjkt+DJU8o4SCDx0+ZUCcAc1LlRNvHAZha1251DEbQi5JvjVuW4E/U4y8lQUknzxg49Mmq9YntXthbcXG8Zm641NdpUt36jCtslUOKx/upCMKVjt1E810umhdQaeb+f0HqK4vOMjqNpu75lMSAP5Atf1oJ9cny7VJ9YfTWp7LqdqW5YLgzObiPGO8prOErAyRkjnv3HFTpG2G271fC1lYBNjtrjS2XFMTIbv/qRnk8KQr/I+YrYJz6IcSRJeOGmUKcUfYDJ/wqHtHD+DfE3ra1xvpiXC3tXFSB2Dg6AT+StX71Keqre/dNM3W3xVpbflxXWG1qzhKlIIBOPLms7NNJdxo+218ixIFlTdnf8AzDq5x66hlIyQgpK059EpbShA/A9aknzqJLBo9Nj3A0q7cJSbhffkJJdkJR0IaZbS00202jJ6UDrV7k5JqXO9cHzuPXJ/tWxvpitT363aZsUu73h/wIMVHUtWCSfIAAdyTgAe9Uy3V3WRrTV9mvOlLTJt12ty8MyQoLddAOUgpA8jnjJ7kVZL4lmwvZq/5/lDSv2cTXHwrwoKdm7JLYiRm5bhfS88hsBbhDywOpQGTxgc+le7+N4cev5PtXO/SQ9D3eXftI2q53GE5AmyY6VvRnElJbX5jB5xnkZ8qzlKV1WZSlKBSlKBSlKBSlKBSlKCkO4cgxfivD9xPS2i6xDlXYIw30/jGKu7UMb8bKM7hvN3i0y0QNQMtBvqWn+rfSOUhRHKSMnCufTHbGl6N3V3Gs+rGNv75Y7fdb6y30ocdl+Cp1KWysErAUlRKRnOAT580E42DT98g6uvV1uepX51tlkCJbPBCW4qf/lySfLy98+UZa71jarvv1o7Tzs5huDZ31yX3VK/q1TC2fCa6uwUOePU47164t/3A1zfbtYEm36XhQEpRNmQl/OOhaxnwkLPSkL6eScZTkeeK2i37YaUjaQVpxy2JlwHVl15chRU866e7pc7hfuCMVW5SLTG1ImQod+K1i2WrTG3VluL0ZMa025x5cyS445hPWRyck+gAAH4rVoO2j9rb8Cy621VChjhLBkofSgeiS4kkD7V6oG2FlFxbuF9k3PUM1o9TSrvKU+22fVLXCB+1O0OtYHaSDKvutdTbiS2HGI136IttbeT0rMVGB1keQUUgge32qXBg180gJACQAkcADyrsO9Z27Xk0h/X1yvtn3htz1ns0m4rnWZUKGoAhlt8vdSlOq/lSlIST5kCo9v+6WrJO2SYlvntf6RMiVIuk5kBIjsNyFNISkAcLWopA88DPnmrReVQbuboOxaQ2+1dLt6FpN6uEd+WtxQPQkyEnoT6JBUo496zy4sM72yntFljI72qf/8ADzNMxanJJhxvEWo5Kl9SMk++c16/hOX1bK2tP+zIkD/qqP8AnUM72b4Rr9b9S6Qh21BgB1LMac09nr8NackpxjpODgg+lTV8KTCmdkrMpQx4zshwfbxlD/Ko8Liy48LMvuq5XdS7SlK9apSlKBSlKBSlKBSlKBWubi6pZ0Vou6X+Q0Xkw2+pLQOOtZISlOfLKiK2OsPq/T0HVemp9kuiVGJMbLayk4UnzCh7ggEfagq5oadr/fKXdpf+m69Px4SkBMSGhQACs44SpJI47qJNbNbPh6vg1Qze7vuBNemNjoElllQkFPSU4C1LOPpJHn3rVntitxtv70q67fXZmX08Dw3A06pPotC/oUPbJ+1ZF/4gdZ6QkIga80ehuUB+tJVHLgHmM9ST+OKrdrTX2sXpfT9v0xZmbZaWS3HbyolSipbizypa1HlSieSayoBHcGoQjbk69nXW13KDom5KsEltLimENtulaFIyFIdCxySU9x2zWy7T2a+s6i1RfrpblWO33VxtUe0qkeMpCwD1uqwcJKiew/8A5VLj9rdkmClK4qq5WKnX62RL5Essic0xdJra3IzK+C6E9+nyJHfHesqa+TrLa3W3VtIU43noWUgqTkYOD5ZqB5LFDl2+2NR7jcnbnISVFUp1tDalZJIHSkADA4/FR98TJH9C9/z/AMHH/wBqKk7Oa0TenSVz1xoGXY7LIisSnnW1lUkqCClJzjIBIOQPKpxvtFmoh/4etmNJas21TedQx35cuc4tAIeU34AQsp+jpI5OOc5qy2mbFb9M2KHZ7MyWIERHQ02VFWBkk5J5OSSfzVWtv9Q6v2M1TadJ61+WVpq4Of1a0KC0s9SsFxKgAcAn6goduRVuRW7EpSlApSlApSlApSlApSlAoe1KUFVYW4G5m5W5F8s2jbtCssG3lwpDzKThCV9A6iUqUVEnPHArMPbE6o1bd4krcrWZuMdg5EeKk9vMAkAJzgchOajbdOzyrb8Sirdt+9Jtl2lutL8XxelIedHWsjA/Rg8g58/LipR1Hq3cnbOfaGNQT7HfYFw6wZUhtURDCk4PSpxPAznjIOai7+kzSebdCjWy3xoMBpLMWM2llptPZCEjAA+wFeiq5y98dWPuoVFstkttoU6pj+NSFyJMPrCQcBSEpOOQM4x71h4W6Op73f3G9Tak/gWmeWmrtY7YtyO+4nHUkOLClJ7n6sEZHbHNU6rdlkNTXiPYLHNuUtbSUR2lOJS66loOKAJCQpXAJxitV2z3QsevkuMwUSYVyaQHVwpaOhzoOMLT5KTyOR+1Rzt1pK26t3Lud8fdu+o9MwoyGocnUHU54koqBUppKkgdAA809zU/Kix/mEyfl2fmEI8JLvQOoI79IPfHtUWSJltdzx3rqTRQz51xjBqlaQOM1r0nSjUjVDF8Rdb3HeaIKorM1XyzuBjCmiCMY9MevethHIquvxgWdqLpmHfo0qe3McmIirQJS/CKC2s8N56QcpHYDzpjN1GXw1z4wbjFvup9MWOzrRMubIcStphQWoKcUgIQceZKTx71bWA2tmFHbdPU4htKVH1IHNQ7s7slpTTjNp1IhMubdXI7chCpTiVIZWpAJKEpSOeeCckVNNbyaYFKUqQpSlApSlApSlApSlApSlBFO72zUDX9xi3iHcn7Lf4yQhE1hPV1AHI6gCk5GeCCD96r5rq1as2w3Mslvc1ndJzdzaaDkxwleUqcKFJ6HCsHGARnPers1UD4y7qI+4umENdKnoUMSCD7unAP9igkSyW/Xt01rebE1rgG0Wf5cOyFWlkl5awVFoDsCE4yef1DiptbZbQ0G0toDYGAkJAH7dq1Hae0u2vRUJ6cvxLpc83Ka5/tPPfWfwAQkeya3Cssq1xx9OwwkYAwPQV1KjkjyrgqHPI47117mq2rSOT511zXOKY5qqzgZBqAPjNkhvb+zR8/U7cgrHslpef/ANCrA1VX4x567hqTSlgjErcShbpQnuVOKShP5+g/vVsJ7UzvpZfbtZd0Fp1au6rdHP8A001sNeCwQRbLHb4I7Ro7bP8AZSB/lXvrdiUpSgUpSgUpSgUpSgUpSgUpSgVTfdW1N66+KmPYZhV8oSzHc6TghtDRcUAfL+b96uRVSZzqbR8aDLkv6USHQlJPq5GKU/3kCovwmJLueltxVaGladYvdrjx4sVTMabGS4ZkpCEnw0KBwlsqASlSgT51kbJura5FjjRocW6XHUbcZCXbY1DcDoeCQFBZICUjqzlROB3qTBya5KiDWW2vX+mp7cWa62q0SpOo5AevVzkqmykoVlDJUAEtI9kpSkZ9q2vFM1ziq27TJp1Fc1yE1zRLopSUJUpZCUpGST5Cqm6MUd2ficevPhFdotTnjNnGU+Gyelo/8y8Kx963b4jdzFsMnQ2kFOStQ3EhiR8sOpTKFf6sY/nUOMeQz6it92A24G3ejUsTAhV5nEPzFp/lOPpbB8wnJ/JNa4TXtlndpOpSlXUKUpQKUpQKUpQKUpQKUpQKUpQKqx8YGnpNrv8Ap/XNqCkutFLDy0jhC0K6mlH75I/Aq09Q78WFzk27Z2eiIOJj7UZ1WM9KCeo/uUgfmg2Ta3Xdu19pePc4K0JkhITLjZyphzzBHoe4PmPzW4KqsmyulISdC2i62qVItl6cbcUqdFWOpWVkdC0n6Vp4H0n04wea3yFr7WlolrhXvSgvbLYBFxtLqW+tPuys56vXBx6Uz8bOTc9pw58b6qX6+cuVHhsF6Y+0wyO63VhCR+TxUeRN49NeL4N3Zu9lkD/Vz7e6n9ikKH99YAN/0o35Nyv9tdb0lCCk263zElJlukcyHEHsACQlJ9SaphxZZXWl8uXGTbdrpubpC3r8EXpibLP6YsAGS6s+gS2D/fgVr8296p1bHLcJl3StrcP1OulK57iPRKRlLWfUlSvYVk4dutlkjiPZLXDhMLVhSYrKW8/fA5/NfK/3iDYLPJud0eDEOMjqWo/sAB5kkgAe9ezj8XGe8nlz8i31igHcXTkraDUls1toyQ74anS2+1KPinqUMnqJ5IWOrPmD59sWu0FqVjV+jrTforZabnMhwtn+RQJCk/hQIqqF7uuot+bxGsOlbYuLYGHQ49Kf7AjjrWewwCcIGSSf2tvo+wRdLaYtlkgA/LwWEspJ7qI7qPuTk/mseTr2/VphvXtmBSlKosUpSgUpSgUpSgUpSgUpSgUpSgVh9Yact+rNNzrJd2vEhy0dCsd0kHKVD0IIBH2rMUoKV6l0fuHslGlTbfOZm6YDoBWSCjKjhJU0o5STwCU/vUo7V6ou+rtPJuc+2RYcVxBSy8zI6ipSVEKygjKeRkcmtg+LNa07M3BDaSrxJMdKsDsOsH/ECq4aJc3WgWG3K0zZro5aXmXIkfoiqcbJUsqLuPIgq4WcDjHODW/FzXD5+GXJxzL4+U/ncPSrGpRZX7w0i6Ehsowrp6/9krx09Xtn271pPxH6tuFrt8DT1jW63NuiiXC0T4hbz0hKccjqVx+MedYS7fDjcLftfcL5PmPP6saSZaorR6kBAyVIz3UvHOR5jAz3r5fDNY7luBuCjUmpZDsyNYGENsqd56nBw2n/AJR1Kz3zj1qcvIuUsRjwyWVpv9IO58WKmNm4tiyZMpxUZRUEghOH1EcgHjn19azm5G9TeodCRrXbY4bnTmum4dSMpZ9UoJ75IznyHv2upcrbEuVulQZrCHY0ptTTyCP1pIwRVeNJ/DHEtGvVTrpMi3TTKA54cN5CvFV1JISF4wPpznIPOOwrL8mWtbadJ86Z34OJHjbUPNkY8C4uoz65ShX/AHVOtYnTGnLRpe2C36ft7ECH1FfhsjGVHuSe5PA5PpWWqixSlKBSlKBSlKBSlKBSlKBSlKBSlY263u32wLEqS0HUBClNBaetKFLCAsgkYTk96DJUrGyL9aWIK5jlyifLIR4hcDySOnBIIwechKiMd8GvLE1bp+WHzHvVvWljo8RXzCQE9YBTznzyPzx3oMw+y3IbLb7aHGz3SsAj9q7pSEpASAAOABXhcvVrbfUy5coSHkrDZbU+kKCjnCcZzk4OB7GvjbdRWe5NRnINzhvCSCWQl5PUvHfAznjz9KDKkAjB5FeWBb4duaLdviR4rZPUUsthAJ9cCvLDv1tmzHI8WWy70JQfEQ4lSFFRWAkEHlWUHIr7ybtborjyJNwiMrYQHHUuPJSW0k4ClAnge5oPbSseu92pDoaXc4KXCUgIMhAJ6v08Z88jHrXuWtKEKWsgJSMknyFB2pWCOrLQIbEsvu/LvOKaSvwHMJUlzwz1cfT9fHOK5b1TbHUJLK5DhUpIShEZwqUFBSkqA6clJCVHPbigzlKwKtWWkLWjxnStKigJDCyXCF9B6OPqwrg4zivqzqa1P+J4EhTpbZRIUENLUehf6cYHJORwOeRQZmlYOPqq0yJLTDchfiOKDfLKwELJICVkjCVEpIAOD+4rOUClKUClKUH/2Q==', NULL);
INSERT INTO `usuarios` (`id_usuario`, `id_empleado`, `id_rol`, `usuario`, `password_hash`, `estado`, `ultimo_acceso`, `intentos_fallidos`, `bloqueado_hasta`, `foto_perfil`, `permisos_personales`) VALUES
(7, 13, 2, 'Uasd_Prueba', 'scrypt$8517c6a2b0628b7582cfea507e7db4f8$6643e2a2a2e2d86aa0739787cd4a3929df48ca48c502a6737266cf8c386f691f0b5fd77c4887c5befc921db12852fff9c1a5c2d84c9743c9993d6ac7246f0168', 'Activo', '2026-10-08 23:41:13', 0, NULL, 'data:image/jpeg;base64,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', '[\"dashboard.ver\",\"empleados.ver\",\"empleados.crear\",\"asistencia.ver\",\"asistencia.guardar\",\"nomina.ver\",\"nomina.crear\",\"incentivos.ver\",\"puestos.ver\"]');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `asistencia`
--
ALTER TABLE `asistencia`
  ADD PRIMARY KEY (`id_asistencia`),
  ADD UNIQUE KEY `uq_asistencia_empleado_fecha` (`id_empleado`,`fecha`),
  ADD KEY `fk_id_empleado` (`id_empleado`);

--
-- Indexes for table `concepto_nomina`
--
ALTER TABLE `concepto_nomina`
  ADD PRIMARY KEY (`id_concepto`);

--
-- Indexes for table `configuracion_asistencia`
--
ALTER TABLE `configuracion_asistencia`
  ADD PRIMARY KEY (`id_configuracion`);

--
-- Indexes for table `detalle_concepto`
--
ALTER TABLE `detalle_concepto`
  ADD PRIMARY KEY (`id_detalle_concepto`),
  ADD KEY `id_detalle` (`id_detalle`),
  ADD KEY `id_concepto` (`id_concepto`);

--
-- Indexes for table `detalle_nomina`
--
ALTER TABLE `detalle_nomina`
  ADD PRIMARY KEY (`id_detalle`),
  ADD KEY `fk_id_nomina` (`id_nomina`),
  ADD KEY `id_empleado` (`id_empleado`);

--
-- Indexes for table `empleados`
--
ALTER TABLE `empleados`
  ADD PRIMARY KEY (`id_empleado`),
  ADD UNIQUE KEY `cedula` (`cedula`),
  ADD UNIQUE KEY `numero_empleado` (`numero_empleado`),
  ADD KEY `fk_id_puesto` (`id_puesto`);

--
-- Indexes for table `historial_salario`
--
ALTER TABLE `historial_salario`
  ADD PRIMARY KEY (`id_historial`),
  ADD UNIQUE KEY `uq_historial_empleado_fecha` (`id_empleado`,`fecha_inicio`),
  ADD KEY `id_empleado` (`id_empleado`),
  ADD KEY `registrado_por` (`registrado_por`);

--
-- Indexes for table `incentivos`
--
ALTER TABLE `incentivos`
  ADD PRIMARY KEY (`id_incentivo`),
  ADD UNIQUE KEY `uq_incentivos_origen` (`id_detalle_concepto_origen`),
  ADD KEY `idx_incentivos_empleado_nomina` (`id_empleado`,`id_nomina`),
  ADD KEY `idx_incentivos_nomina` (`id_nomina`);

--
-- Indexes for table `nomina`
--
ALTER TABLE `nomina`
  ADD PRIMARY KEY (`id_nomina`);

--
-- Indexes for table `nomina_calculo_guardado`
--
ALTER TABLE `nomina_calculo_guardado`
  ADD PRIMARY KEY (`id_nomina`);

--
-- Indexes for table `puestos`
--
ALTER TABLE `puestos`
  ADD PRIMARY KEY (`id_puesto`);

--
-- Indexes for table `rol`
--
ALTER TABLE `rol`
  ADD PRIMARY KEY (`id_rol`),
  ADD UNIQUE KEY `nombre` (`nombre`);

--
-- Indexes for table `tasas_descuentos`
--
ALTER TABLE `tasas_descuentos`
  ADD PRIMARY KEY (`id_tasa`),
  ADD UNIQUE KEY `vigente_desde` (`vigente_desde`);

--
-- Indexes for table `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id_usuario`),
  ADD UNIQUE KEY `usuario` (`usuario`),
  ADD UNIQUE KEY `fk_id_empleado` (`id_empleado`) USING BTREE,
  ADD KEY `fk_id_rol` (`id_rol`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `asistencia`
--
ALTER TABLE `asistencia`
  MODIFY `id_asistencia` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=294;

--
-- AUTO_INCREMENT for table `concepto_nomina`
--
ALTER TABLE `concepto_nomina`
  MODIFY `id_concepto` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `detalle_concepto`
--
ALTER TABLE `detalle_concepto`
  MODIFY `id_detalle_concepto` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `detalle_nomina`
--
ALTER TABLE `detalle_nomina`
  MODIFY `id_detalle` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `empleados`
--
ALTER TABLE `empleados`
  MODIFY `id_empleado` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `historial_salario`
--
ALTER TABLE `historial_salario`
  MODIFY `id_historial` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `incentivos`
--
ALTER TABLE `incentivos`
  MODIFY `id_incentivo` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `nomina`
--
ALTER TABLE `nomina`
  MODIFY `id_nomina` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `puestos`
--
ALTER TABLE `puestos`
  MODIFY `id_puesto` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `rol`
--
ALTER TABLE `rol`
  MODIFY `id_rol` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `tasas_descuentos`
--
ALTER TABLE `tasas_descuentos`
  MODIFY `id_tasa` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id_usuario` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `asistencia`
--
ALTER TABLE `asistencia`
  ADD CONSTRAINT `fk_id_empleado` FOREIGN KEY (`id_empleado`) REFERENCES `empleados` (`id_empleado`);

--
-- Constraints for table `detalle_concepto`
--
ALTER TABLE `detalle_concepto`
  ADD CONSTRAINT `detalle_concepto_ibfk_1` FOREIGN KEY (`id_detalle`) REFERENCES `detalle_nomina` (`id_detalle`),
  ADD CONSTRAINT `detalle_concepto_ibfk_2` FOREIGN KEY (`id_concepto`) REFERENCES `concepto_nomina` (`id_concepto`);

--
-- Constraints for table `detalle_nomina`
--
ALTER TABLE `detalle_nomina`
  ADD CONSTRAINT `detalle_nomina_ibfk_1` FOREIGN KEY (`id_empleado`) REFERENCES `empleados` (`id_empleado`),
  ADD CONSTRAINT `fk_id_nomina` FOREIGN KEY (`id_nomina`) REFERENCES `nomina` (`id_nomina`);

--
-- Constraints for table `empleados`
--
ALTER TABLE `empleados`
  ADD CONSTRAINT `fk_id_puesto` FOREIGN KEY (`id_puesto`) REFERENCES `puestos` (`id_puesto`);

--
-- Constraints for table `historial_salario`
--
ALTER TABLE `historial_salario`
  ADD CONSTRAINT `historial_salario_ibfk_1` FOREIGN KEY (`id_empleado`) REFERENCES `empleados` (`id_empleado`),
  ADD CONSTRAINT `historial_salario_ibfk_2` FOREIGN KEY (`registrado_por`) REFERENCES `usuarios` (`id_usuario`);

--
-- Constraints for table `incentivos`
--
ALTER TABLE `incentivos`
  ADD CONSTRAINT `fk_incentivos_empleado` FOREIGN KEY (`id_empleado`) REFERENCES `empleados` (`id_empleado`),
  ADD CONSTRAINT `fk_incentivos_nomina` FOREIGN KEY (`id_nomina`) REFERENCES `nomina` (`id_nomina`);

--
-- Constraints for table `nomina_calculo_guardado`
--
ALTER TABLE `nomina_calculo_guardado`
  ADD CONSTRAINT `fk_calculo_guardado_nomina` FOREIGN KEY (`id_nomina`) REFERENCES `nomina` (`id_nomina`);

--
-- Constraints for table `usuarios`
--
ALTER TABLE `usuarios`
  ADD CONSTRAINT `fk_id_rol` FOREIGN KEY (`id_rol`) REFERENCES `rol` (`id_rol`),
  ADD CONSTRAINT `usuarios_ibfk_1` FOREIGN KEY (`id_empleado`) REFERENCES `empleados` (`id_empleado`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
