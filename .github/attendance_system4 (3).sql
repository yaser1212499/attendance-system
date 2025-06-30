-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jun 25, 2025 at 06:15 PM
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
-- Database: `attendance_system4`
--

-- --------------------------------------------------------

--
-- Table structure for table `attendances`
--

CREATE TABLE `attendances` (
  `id` int(11) NOT NULL,
  `user_id` varchar(255) NOT NULL,
  `employee_id` varchar(50) DEFAULT NULL,
  `timestamp` datetime NOT NULL,
  `type` enum('ورود','خروج') NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `device_id` int(11) DEFAULT NULL,
  `device_user_id` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `attendances`
--

INSERT INTO `attendances` (`id`, `user_id`, `employee_id`, `timestamp`, `type`, `created_at`, `device_id`, `device_user_id`) VALUES
(1, '4', NULL, '2025-06-17 06:53:48', 'ورود', '2025-06-21 20:10:21', NULL, NULL),
(2, '2', NULL, '2025-06-17 07:14:23', 'ورود', '2025-06-21 20:10:21', NULL, NULL),
(3, '2', NULL, '2025-06-17 07:14:25', 'خروج', '2025-06-21 20:10:21', NULL, NULL),
(4, '2', NULL, '2025-06-17 07:14:27', 'ورود', '2025-06-21 20:10:21', NULL, NULL),
(5, '2', NULL, '2025-06-17 07:14:29', 'خروج', '2025-06-21 20:10:21', NULL, NULL),
(6, '1', NULL, '2025-06-17 08:05:52', 'ورود', '2025-06-21 20:10:21', NULL, NULL),
(7, '1', NULL, '2025-06-17 08:06:05', 'خروج', '2025-06-21 20:10:21', NULL, NULL),
(8, '2', NULL, '2025-06-17 08:47:26', 'ورود', '2025-06-21 20:10:21', NULL, NULL),
(9, '2', NULL, '2025-06-17 08:47:28', 'خروج', '2025-06-21 20:10:21', NULL, NULL),
(10, '2', NULL, '2025-06-17 10:48:56', 'ورود', '2025-06-21 20:10:21', NULL, NULL),
(11, '2', NULL, '2025-06-17 10:48:59', 'خروج', '2025-06-21 20:10:21', NULL, NULL),
(12, '1', NULL, '2025-06-17 10:49:02', 'ورود', '2025-06-21 20:10:21', NULL, NULL),
(13, '2', NULL, '2025-06-18 02:06:36', 'ورود', '2025-06-21 20:10:21', NULL, NULL),
(14, '2', NULL, '2025-06-18 02:06:39', 'خروج', '2025-06-21 20:10:21', NULL, NULL),
(15, '1', NULL, '2025-06-18 02:07:35', 'خروج', '2025-06-21 20:10:21', NULL, NULL),
(16, '1', NULL, '2025-06-18 02:07:39', 'ورود', '2025-06-21 20:10:21', NULL, NULL),
(17, '1', NULL, '2025-06-18 03:28:40', 'خروج', '2025-06-21 20:10:21', NULL, NULL),
(18, '1', NULL, '2025-06-18 03:28:42', 'ورود', '2025-06-21 20:10:21', NULL, NULL),
(19, '1', NULL, '2025-06-18 03:55:29', 'خروج', '2025-06-21 20:10:21', NULL, NULL),
(20, '1', NULL, '2025-06-18 03:55:31', 'ورود', '2025-06-21 20:10:21', NULL, NULL),
(21, '1', NULL, '2025-06-18 04:01:16', 'خروج', '2025-06-21 20:10:21', NULL, NULL),
(22, '1', NULL, '2025-06-18 04:10:46', 'ورود', '2025-06-21 20:10:21', NULL, NULL),
(23, '4', NULL, '2025-06-18 05:30:59', 'خروج', '2025-06-21 20:10:21', NULL, NULL),
(24, '1', NULL, '2025-06-18 07:10:27', 'خروج', '2025-06-21 20:10:21', NULL, NULL),
(25, '2', NULL, '2025-06-18 07:21:04', 'ورود', '2025-06-21 20:10:21', NULL, NULL),
(26, '1', NULL, '2025-06-18 07:22:26', 'ورود', '2025-06-21 20:10:21', NULL, NULL),
(27, '1', NULL, '2025-06-18 07:22:28', 'خروج', '2025-06-21 20:10:21', NULL, NULL),
(28, '2', NULL, '2025-06-19 11:37:19', 'خروج', '2025-06-21 20:10:21', NULL, NULL),
(29, '2', NULL, '2025-06-19 11:37:23', 'ورود', '2025-06-21 20:10:21', NULL, NULL),
(30, '1', NULL, '2025-06-19 11:37:28', 'ورود', '2025-06-21 20:10:21', NULL, NULL),
(31, '1', NULL, '2025-06-19 11:37:31', 'خروج', '2025-06-21 20:10:21', NULL, NULL),
(32, '1', NULL, '2025-06-19 11:37:34', 'ورود', '2025-06-21 20:10:21', NULL, NULL),
(33, '2', NULL, '2025-06-21 08:36:22', 'خروج', '2025-06-21 20:10:21', NULL, NULL),
(34, '2', NULL, '2025-06-21 11:03:18', 'ورود', '2025-06-21 20:10:21', NULL, NULL),
(35, '2', NULL, '2025-06-21 11:03:21', 'خروج', '2025-06-21 20:10:21', NULL, NULL),
(36, '1', NULL, '2025-06-21 11:03:24', 'خروج', '2025-06-21 20:10:21', NULL, NULL),
(37, '2', NULL, '2025-06-21 11:49:05', 'ورود', '2025-06-21 20:10:21', NULL, NULL),
(38, '2', NULL, '2025-06-21 11:49:08', 'خروج', '2025-06-21 20:10:21', NULL, NULL),
(39, '1', NULL, '2025-06-21 11:49:11', 'ورود', '2025-06-21 20:10:21', NULL, NULL),
(40, '2', NULL, '2025-06-21 11:55:36', 'ورود', '2025-06-21 20:10:21', NULL, NULL),
(41, '2', NULL, '2025-06-21 11:55:38', 'خروج', '2025-06-21 20:10:21', NULL, NULL),
(42, '1', NULL, '2025-06-21 11:55:42', 'خروج', '2025-06-21 20:10:21', NULL, NULL),
(43, '2', NULL, '2025-06-21 12:05:31', 'ورود', '2025-06-21 20:10:21', NULL, NULL),
(44, '2', NULL, '2025-06-21 12:05:34', 'خروج', '2025-06-21 20:10:21', NULL, NULL),
(45, '1', NULL, '2025-06-21 12:05:36', 'ورود', '2025-06-21 20:10:21', NULL, NULL),
(46, '2', NULL, '2025-06-21 12:25:01', 'ورود', '2025-06-21 20:10:21', NULL, NULL),
(47, '2', NULL, '2025-06-21 12:25:04', 'خروج', '2025-06-21 20:10:21', NULL, NULL),
(48, '1', NULL, '2025-06-21 12:25:06', 'خروج', '2025-06-21 20:10:21', NULL, NULL),
(49, '1', NULL, '2025-06-21 13:35:20', 'ورود', '2025-06-21 21:06:48', NULL, NULL),
(50, '1', NULL, '2025-06-21 13:35:23', 'خروج', '2025-06-21 21:06:48', NULL, NULL),
(51, '2', NULL, '2025-06-21 13:35:30', 'ورود', '2025-06-21 21:06:48', NULL, NULL),
(52, '2', NULL, '2025-06-21 14:31:14', 'خروج', '2025-06-21 22:01:42', NULL, NULL),
(53, '2', NULL, '2025-06-21 14:31:16', 'ورود', '2025-06-21 22:01:43', NULL, NULL),
(54, '1', NULL, '2025-06-21 14:31:19', 'ورود', '2025-06-21 22:01:43', NULL, NULL),
(55, '2', NULL, '2025-06-21 14:41:12', 'خروج', '2025-06-21 22:11:47', NULL, NULL),
(56, '2', NULL, '2025-06-21 14:41:14', 'ورود', '2025-06-21 22:11:47', NULL, NULL),
(57, '2', NULL, '2025-06-21 14:41:17', 'خروج', '2025-06-21 22:11:47', NULL, NULL),
(58, '1', NULL, '2025-06-21 14:41:19', 'خروج', '2025-06-21 22:11:47', NULL, NULL),
(59, '1', NULL, '2025-06-21 14:41:22', 'ورود', '2025-06-21 22:11:47', NULL, NULL),
(60, '2', NULL, '2025-06-22 03:05:35', 'ورود', '2025-06-22 10:52:30', NULL, NULL),
(61, '2', NULL, '2025-06-22 03:05:37', 'خروج', '2025-06-22 10:52:30', NULL, NULL),
(62, '2', NULL, '2025-06-22 03:05:39', 'ورود', '2025-06-22 10:52:30', NULL, NULL),
(63, '2', NULL, '2025-06-22 03:05:41', 'خروج', '2025-06-22 10:52:30', NULL, NULL),
(64, '1', NULL, '2025-06-22 03:22:04', 'خروج', '2025-06-22 10:52:30', NULL, NULL),
(65, '4', NULL, '2025-06-22 03:22:49', 'ورود', '2025-06-22 10:52:44', NULL, NULL),
(66, '4', NULL, '2025-06-22 03:24:03', 'خروج', '2025-06-22 10:54:01', NULL, NULL),
(67, '4', NULL, '2025-06-22 03:24:14', 'ورود', '2025-06-22 10:54:11', NULL, NULL),
(68, '4', NULL, '2025-06-22 03:26:51', 'خروج', '2025-06-22 10:57:02', NULL, NULL),
(69, '4', NULL, '2025-06-22 03:29:35', 'ورود', '2025-06-22 11:00:04', NULL, NULL),
(70, '4', NULL, '2025-06-22 03:30:32', 'خروج', '2025-06-22 12:41:51', NULL, NULL),
(71, '1', NULL, '2025-06-22 03:32:56', 'ورود', '2025-06-22 12:41:51', NULL, NULL),
(72, '1', NULL, '2025-06-22 08:07:27', 'خروج', '2025-06-22 15:37:33', NULL, NULL),
(73, '1', NULL, '2025-06-22 08:07:30', 'ورود', '2025-06-22 15:37:33', NULL, NULL),
(74, '1', NULL, '2025-06-22 10:27:13', 'خروج', '2025-06-22 17:57:22', NULL, NULL),
(75, '1', NULL, '2025-06-22 10:27:23', 'ورود', '2025-06-22 17:57:22', NULL, NULL),
(76, '2', NULL, '2025-06-22 10:27:26', 'ورود', '2025-06-22 17:57:22', NULL, NULL),
(77, '2', NULL, '2025-06-22 10:27:40', 'خروج', '2025-06-22 17:57:37', NULL, NULL),
(78, '1', NULL, '2025-06-22 12:00:51', 'خروج', '2025-06-22 19:41:46', NULL, NULL),
(79, '1', NULL, '2025-06-22 12:00:55', 'ورود', '2025-06-22 19:41:46', NULL, NULL),
(80, '1', NULL, '2025-06-22 12:00:58', 'خروج', '2025-06-22 19:41:46', NULL, NULL),
(81, '2', NULL, '2025-06-22 12:01:08', 'ورود', '2025-06-22 19:41:46', NULL, NULL),
(82, '2', NULL, '2025-06-22 12:01:11', 'خروج', '2025-06-22 19:41:46', NULL, NULL),
(83, '2', NULL, '2025-06-23 02:29:55', 'ورود', '2025-06-23 10:06:55', NULL, NULL),
(84, '2', NULL, '2025-06-23 02:29:58', 'خروج', '2025-06-23 10:06:55', NULL, NULL),
(85, '2', NULL, '2025-06-23 08:51:29', 'ورود', '2025-06-23 16:21:30', NULL, NULL),
(86, '4', NULL, '2025-06-23 08:55:21', 'ورود', '2025-06-23 16:25:19', NULL, NULL),
(87, '4', NULL, '2025-06-23 08:55:30', 'خروج', '2025-06-23 16:25:28', NULL, NULL),
(88, '4', NULL, '2025-06-23 09:00:56', 'ورود', '2025-06-23 19:01:33', NULL, NULL),
(89, '2', NULL, '2025-06-23 10:32:24', 'خروج', '2025-06-23 19:01:33', NULL, NULL),
(90, '2', NULL, '2025-06-23 10:32:27', 'ورود', '2025-06-23 19:01:33', NULL, NULL),
(91, '1', NULL, '2025-06-23 10:32:31', 'ورود', '2025-06-23 19:01:33', NULL, NULL),
(92, '2', NULL, '2025-06-24 03:16:48', 'خروج', '2025-06-24 10:47:03', NULL, NULL),
(93, '2', NULL, '2025-06-24 03:16:52', 'ورود', '2025-06-24 10:47:03', NULL, NULL),
(94, '2', NULL, '2025-06-24 08:51:36', 'خروج', '2025-06-24 16:24:09', NULL, NULL),
(95, '2', NULL, '2025-06-24 08:51:38', 'ورود', '2025-06-24 16:24:09', NULL, NULL),
(96, '2', NULL, '2025-06-24 08:57:57', 'خروج', '2025-06-24 16:27:56', NULL, NULL),
(97, '2', NULL, '2025-06-24 08:57:59', 'ورود', '2025-06-24 16:27:56', NULL, NULL),
(98, '2', NULL, '2025-06-24 11:40:32', 'خروج', '2025-06-24 19:44:37', NULL, NULL),
(99, '2', NULL, '2025-06-24 11:40:34', 'ورود', '2025-06-24 19:44:37', NULL, NULL),
(100, '2', NULL, '2025-06-24 11:40:37', 'خروج', '2025-06-24 19:44:37', NULL, NULL),
(101, '1', NULL, '2025-06-24 11:40:39', 'خروج', '2025-06-24 19:44:37', NULL, NULL),
(102, '1', NULL, '2025-06-24 11:40:41', 'ورود', '2025-06-24 19:44:37', NULL, NULL),
(103, '1', NULL, '2025-06-24 11:40:45', 'خروج', '2025-06-24 19:44:37', NULL, NULL),
(104, '1', NULL, '2025-06-24 11:40:48', 'ورود', '2025-06-24 19:44:37', NULL, NULL),
(105, '1', NULL, '2025-06-24 16:41:48', 'خروج', '2025-06-25 00:12:01', NULL, NULL),
(106, '1', NULL, '2025-06-24 16:41:51', 'ورود', '2025-06-25 00:12:01', NULL, NULL),
(107, '2', NULL, '2025-06-25 01:00:26', 'ورود', '2025-06-25 08:34:52', NULL, NULL),
(108, '2', NULL, '2025-06-25 01:00:29', 'خروج', '2025-06-25 08:34:52', NULL, NULL),
(109, '2', NULL, '2025-06-25 02:32:25', 'ورود', '2025-06-25 10:53:48', NULL, NULL),
(110, '2', NULL, '2025-06-25 02:32:38', 'خروج', '2025-06-25 10:53:48', NULL, NULL),
(111, '1', NULL, '2025-06-25 02:33:02', 'خروج', '2025-06-25 10:53:48', NULL, NULL),
(112, '2', NULL, '2025-06-25 03:24:05', 'ورود', '2025-06-25 10:54:06', NULL, NULL),
(113, '2', NULL, '2025-06-25 03:33:25', 'خروج', '2025-06-25 11:06:52', NULL, NULL),
(114, '2', NULL, '2025-06-25 03:53:02', 'ورود', '2025-06-25 11:23:00', NULL, NULL),
(115, '2', NULL, '2025-06-25 04:09:57', 'خروج', '2025-06-25 12:23:41', NULL, NULL),
(116, '2', NULL, '2025-06-25 04:14:22', 'ورود', '2025-06-25 12:23:41', NULL, NULL),
(117, '2', NULL, '2025-06-25 04:14:24', 'خروج', '2025-06-25 12:23:41', NULL, NULL),
(118, '2', NULL, '2025-06-25 04:14:30', 'ورود', '2025-06-25 12:23:41', NULL, NULL),
(119, '2', NULL, '2025-06-25 04:14:32', 'خروج', '2025-06-25 12:23:41', NULL, NULL),
(120, '2', NULL, '2025-06-25 04:14:35', 'ورود', '2025-06-25 12:23:41', NULL, NULL),
(121, '2', NULL, '2025-06-25 04:14:39', 'خروج', '2025-06-25 12:23:41', NULL, NULL),
(122, '2', NULL, '2025-06-25 04:14:43', 'ورود', '2025-06-25 12:23:41', NULL, NULL),
(123, '1', NULL, '2025-06-25 04:14:46', 'ورود', '2025-06-25 12:23:41', NULL, NULL),
(124, '2', NULL, '2025-06-25 04:53:50', 'خروج', '2025-06-25 12:23:48', NULL, NULL),
(125, '2', NULL, '2025-06-25 04:55:46', 'ورود', '2025-06-25 12:29:45', NULL, NULL),
(126, '2', NULL, '2025-06-25 05:02:04', 'خروج', '2025-06-25 12:45:30', NULL, NULL),
(127, '2', NULL, '2025-06-25 05:21:19', 'ورود', '2025-06-25 13:14:55', NULL, NULL),
(128, '2', NULL, '2025-06-25 05:45:05', 'خروج', '2025-06-25 13:15:05', NULL, NULL),
(129, '2', NULL, '2025-06-25 05:45:07', 'ورود', '2025-06-25 13:15:05', NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `devices`
--

CREATE TABLE `devices` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `ip_address` varchar(50) NOT NULL,
  `location` varchar(100) DEFAULT NULL,
  `serial_number` varchar(100) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `leaves`
--

CREATE TABLE `leaves` (
  `id` int(11) NOT NULL,
  `user_id` varchar(255) NOT NULL,
  `type` enum('annual','sick','emergency','maternity','other') NOT NULL,
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  `days` int(11) NOT NULL,
  `reason` text DEFAULT NULL,
  `status` enum('pending','approved','rejected') DEFAULT 'pending',
  `manager_comment` text DEFAULT NULL,
  `requested_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `reviewed_at` timestamp NULL DEFAULT NULL,
  `hour_from` time DEFAULT NULL,
  `hour_to` time DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `leaves`
--

INSERT INTO `leaves` (`id`, `user_id`, `type`, `start_date`, `end_date`, `days`, `reason`, `status`, `manager_comment`, `requested_at`, `reviewed_at`, `hour_from`, `hour_to`) VALUES
(1, '7', 'emergency', '2025-06-22', '2025-06-25', 4, 'تست', 'approved', '', '2025-06-22 11:22:19', '2025-06-22 11:23:07', NULL, NULL),
(2, '2', 'emergency', '2025-06-23', '2025-06-23', 1, '', 'pending', NULL, '2025-06-23 10:51:58', NULL, '15:21:00', '20:26:00'),
(3, '43', 'emergency', '2025-06-25', '2025-06-27', 3, '', 'approved', '', '2025-06-24 23:23:57', '2025-06-24 23:24:19', '06:53:00', '08:53:00');

-- --------------------------------------------------------

--
-- Table structure for table `notifications`
--

CREATE TABLE `notifications` (
  `id` int(11) NOT NULL,
  `user_id` varchar(255) DEFAULT NULL,
  `title` varchar(255) NOT NULL,
  `message` text NOT NULL,
  `type` enum('info','success','warning','error') DEFAULT 'info',
  `is_read` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `notifications`
--

INSERT INTO `notifications` (`id`, `user_id`, `title`, `message`, `type`, `is_read`, `created_at`) VALUES
(1, '2', 'تت', 'ااتا', 'info', 0, '2025-06-22 01:06:56');

-- --------------------------------------------------------

--
-- Table structure for table `pending_device_users`
--

CREATE TABLE `pending_device_users` (
  `id` int(11) NOT NULL,
  `user_id` varchar(255) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `role` int(11) DEFAULT NULL,
  `cardno` varchar(255) DEFAULT NULL,
  `province` varchar(100) DEFAULT NULL,
  `district` varchar(100) DEFAULT NULL,
  `salary` decimal(10,2) DEFAULT NULL,
  `shift` varchar(50) DEFAULT NULL,
  `department` varchar(100) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `address` text DEFAULT NULL,
  `hire_date` date DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `salaries`
--

CREATE TABLE `salaries` (
  `id` int(11) NOT NULL,
  `user_id` varchar(255) NOT NULL,
  `base_salary` decimal(15,2) NOT NULL,
  `month` int(11) NOT NULL,
  `year` int(11) NOT NULL,
  `total_overtime_hours` decimal(6,2) DEFAULT 0.00,
  `total_undertime_hours` decimal(6,2) DEFAULT 0.00,
  `overtime_rate` decimal(5,2) DEFAULT 1.50,
  `undertime_rate` decimal(5,2) DEFAULT 1.00,
  `total_salary` decimal(15,2) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `tax` decimal(15,2) DEFAULT 0.00,
  `bonus` decimal(15,2) DEFAULT 0.00,
  `deductions` decimal(15,2) DEFAULT 0.00,
  `payment_date` date DEFAULT NULL,
  `status` enum('pending','paid','failed') DEFAULT 'pending'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `salaries`
--

INSERT INTO `salaries` (`id`, `user_id`, `base_salary`, `month`, `year`, `total_overtime_hours`, `total_undertime_hours`, `overtime_rate`, `undertime_rate`, `total_salary`, `created_at`, `tax`, `bonus`, `deductions`, `payment_date`, `status`) VALUES
(1, '1', 20000.00, 6, 2025, 55.53, 5.03, 1.50, 1.00, 28893.75, '2025-06-22 19:44:49', 0.00, 0.00, 0.00, NULL, 'pending'),
(2, '2', 0.00, 6, 2025, 0.00, 0.00, 1.50, 1.00, 0.00, '2025-06-22 19:44:49', 0.00, 0.00, 0.00, NULL, 'pending'),
(3, '3', 0.00, 6, 2025, 0.00, 0.00, 1.50, 1.00, 0.00, '2025-06-22 19:44:49', 0.00, 0.00, 0.00, NULL, 'pending'),
(4, '4', 30000.00, 6, 2025, 0.00, 0.00, 1.50, 1.00, 30000.00, '2025-06-22 19:44:49', 0.00, 0.00, 0.00, NULL, 'paid'),
(5, '5', 0.00, 6, 2025, 1.59, 0.21, 1.50, 1.00, 0.00, '2025-06-22 19:44:49', 0.00, 0.00, 0.00, NULL, 'pending'),
(6, '6', 0.00, 6, 2025, 5.00, 0.23, 1.50, 1.00, 0.00, '2025-06-22 19:44:49', 0.00, 0.00, 0.00, NULL, 'pending'),
(7, '7', 0.00, 6, 2025, 0.42, 0.06, 1.50, 1.00, 0.00, '2025-06-22 19:44:49', 0.00, 0.00, 0.00, NULL, 'pending'),
(8, '8', 20000.00, 6, 2025, 3.00, 1.00, 1.50, 1.00, 20397.73, '2025-06-22 19:44:49', 0.00, 0.00, 0.00, NULL, 'pending'),
(9, '1', 20000.00, 6, 2025, 55.53, 5.03, 1.50, 1.00, 28893.75, '2025-06-22 19:51:41', 0.00, 0.00, 0.00, NULL, 'pending'),
(10, '2', 0.00, 6, 2025, 0.00, 0.00, 1.50, 1.00, 0.00, '2025-06-22 19:51:41', 0.00, 0.00, 0.00, NULL, 'pending'),
(11, '3', 0.00, 6, 2025, 0.00, 0.00, 1.50, 1.00, 0.00, '2025-06-22 19:51:41', 0.00, 0.00, 0.00, NULL, 'pending'),
(12, '4', 30000.00, 6, 2025, 0.00, 0.00, 1.50, 1.00, 30000.00, '2025-06-22 19:51:41', 0.00, 0.00, 0.00, NULL, 'pending'),
(13, '5', 0.00, 6, 2025, 1.59, 0.21, 1.50, 1.00, 0.00, '2025-06-22 19:51:41', 0.00, 0.00, 0.00, NULL, 'pending'),
(14, '6', 0.00, 6, 2025, 5.00, 0.23, 1.50, 1.00, 0.00, '2025-06-22 19:51:41', 0.00, 0.00, 0.00, NULL, 'pending'),
(15, '7', 0.00, 6, 2025, 0.42, 0.06, 1.50, 1.00, 0.00, '2025-06-22 19:51:41', 0.00, 0.00, 0.00, NULL, 'pending'),
(16, '8', 20000.00, 6, 2025, 3.00, 1.00, 1.50, 1.00, 20397.73, '2025-06-22 19:51:41', 0.00, 0.00, 0.00, NULL, 'pending'),
(17, '1', 20000.00, 6, 2025, 55.53, 5.03, 1.50, 1.00, 28893.75, '2025-06-22 19:51:42', 0.00, 0.00, 0.00, NULL, 'pending'),
(18, '2', 0.00, 6, 2025, 0.00, 0.00, 1.50, 1.00, 0.00, '2025-06-22 19:51:42', 0.00, 0.00, 0.00, NULL, 'pending'),
(19, '3', 0.00, 6, 2025, 0.00, 0.00, 1.50, 1.00, 0.00, '2025-06-22 19:51:42', 0.00, 0.00, 0.00, NULL, 'pending'),
(20, '4', 30000.00, 6, 2025, 0.00, 0.00, 1.50, 1.00, 30000.00, '2025-06-22 19:51:42', 0.00, 0.00, 0.00, NULL, 'paid'),
(21, '5', 0.00, 6, 2025, 1.59, 0.21, 1.50, 1.00, 0.00, '2025-06-22 19:51:42', 0.00, 0.00, 0.00, NULL, 'pending'),
(22, '6', 0.00, 6, 2025, 5.00, 0.23, 1.50, 1.00, 0.00, '2025-06-22 19:51:42', 0.00, 0.00, 0.00, NULL, 'paid'),
(23, '7', 0.00, 6, 2025, 0.42, 0.06, 1.50, 1.00, 0.00, '2025-06-22 19:51:42', 0.00, 0.00, 0.00, NULL, 'pending'),
(24, '8', 20000.00, 6, 2025, 3.00, 1.00, 1.50, 1.00, 20397.73, '2025-06-22 19:51:42', 0.00, 0.00, 0.00, NULL, 'paid'),
(25, '1', 20000.00, 6, 2025, 55.53, 5.03, 1.50, 1.00, 28893.75, '2025-06-22 20:49:37', 0.00, 0.00, 0.00, NULL, 'pending'),
(26, '2', 0.00, 6, 2025, 0.00, 0.00, 1.50, 1.00, 0.00, '2025-06-22 20:49:37', 0.00, 0.00, 0.00, NULL, 'pending'),
(27, '3', 0.00, 6, 2025, 0.00, 0.00, 1.50, 1.00, 0.00, '2025-06-22 20:49:37', 0.00, 0.00, 0.00, NULL, 'pending'),
(28, '4', 30000.00, 6, 2025, 0.00, 0.00, 1.50, 1.00, 30000.00, '2025-06-22 20:49:37', 0.00, 0.00, 0.00, NULL, 'paid'),
(29, '5', 0.00, 6, 2025, 1.59, 0.21, 1.50, 1.00, 0.00, '2025-06-22 20:49:37', 0.00, 0.00, 0.00, NULL, 'pending'),
(30, '6', 0.00, 6, 2025, 5.00, 0.23, 1.50, 1.00, 0.00, '2025-06-22 20:49:37', 0.00, 0.00, 0.00, NULL, 'pending'),
(31, '7', 0.00, 6, 2025, 0.42, 0.06, 1.50, 1.00, 0.00, '2025-06-22 20:49:37', 0.00, 0.00, 0.00, NULL, 'pending'),
(32, '8', 20000.00, 6, 2025, 3.00, 1.00, 1.50, 1.00, 20397.73, '2025-06-22 20:49:37', 0.00, 0.00, 0.00, NULL, 'pending'),
(33, '1', 20000.00, 6, 2025, 55.53, 5.03, 1.50, 1.00, 28893.75, '2025-06-22 20:49:38', 0.00, 0.00, 0.00, NULL, 'pending'),
(34, '2', 0.00, 6, 2025, 0.00, 0.00, 1.50, 1.00, 0.00, '2025-06-22 20:49:38', 0.00, 0.00, 0.00, NULL, 'pending'),
(35, '3', 0.00, 6, 2025, 0.00, 0.00, 1.50, 1.00, 0.00, '2025-06-22 20:49:38', 0.00, 0.00, 0.00, NULL, 'pending'),
(36, '4', 30000.00, 6, 2025, 0.00, 0.00, 1.50, 1.00, 30000.00, '2025-06-22 20:49:38', 0.00, 0.00, 0.00, NULL, 'pending'),
(37, '5', 0.00, 6, 2025, 1.59, 0.21, 1.50, 1.00, 0.00, '2025-06-22 20:49:38', 0.00, 0.00, 0.00, NULL, 'pending'),
(38, '6', 0.00, 6, 2025, 5.00, 0.23, 1.50, 1.00, 0.00, '2025-06-22 20:49:38', 0.00, 0.00, 0.00, NULL, 'pending'),
(39, '7', 0.00, 6, 2025, 0.42, 0.06, 1.50, 1.00, 0.00, '2025-06-22 20:49:38', 0.00, 0.00, 0.00, NULL, 'pending'),
(40, '8', 20000.00, 6, 2025, 3.00, 1.00, 1.50, 1.00, 20397.73, '2025-06-22 20:49:38', 0.00, 0.00, 0.00, NULL, 'pending');

-- --------------------------------------------------------

--
-- Table structure for table `settings`
--

CREATE TABLE `settings` (
  `id` int(11) NOT NULL,
  `setting_key` varchar(100) NOT NULL,
  `setting_value` text DEFAULT NULL,
  `description` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `settings`
--

INSERT INTO `settings` (`id`, `setting_key`, `setting_value`, `description`, `created_at`, `updated_at`) VALUES
(1, 'morningStart', '08:00', 'تنظیمات ساعات کاری - morningStart', '2025-06-22 01:08:09', '2025-06-22 01:08:09'),
(2, 'morningEnd', '12:00', 'تنظیمات ساعات کاری - morningEnd', '2025-06-22 01:08:09', '2025-06-22 01:08:09'),
(3, 'afternoonStart', '13:00', 'تنظیمات ساعات کاری - afternoonStart', '2025-06-22 01:08:09', '2025-06-22 01:08:09'),
(4, 'afternoonEnd', '17:00', 'تنظیمات ساعات کاری - afternoonEnd', '2025-06-22 01:08:09', '2025-06-22 01:08:09'),
(5, 'maxLateMinutes', '15', 'تنظیمات ساعات کاری - maxLateMinutes', '2025-06-22 01:08:09', '2025-06-22 01:08:09'),
(6, 'holiday_2025-06-22', 'عید', 'تعطیل رسمی - 2025-06-22', '2025-06-22 01:08:26', '2025-06-22 01:08:26'),
(7, 'deviceIP', '192.168.0.50', 'تنظیمات دستگاه - deviceIP', '2025-06-22 01:08:34', '2025-06-22 01:08:34'),
(8, 'devicePort', '4370', 'تنظیمات دستگاه - devicePort', '2025-06-22 01:08:34', '2025-06-22 01:08:34'),
(9, 'deviceName', 'دستگاه اصلی', 'تنظیمات دستگاه - deviceName', '2025-06-22 01:08:34', '2025-06-22 01:08:34'),
(10, 'deviceLocation', 'ورودی اصلی', 'تنظیمات دستگاه - deviceLocation', '2025-06-22 01:08:34', '2025-06-22 01:08:34'),
(11, 'coef_overtime', '1.5', 'ضریب اضافه‌کاری', '2025-06-22 20:47:33', '2025-06-22 20:47:33'),
(12, 'coef_undertime', '9', 'ضریب کم‌کاری', '2025-06-22 20:47:33', '2025-06-22 20:48:59'),
(13, 'coef_tax', '1', 'ضریب مالیات', '2025-06-22 20:47:33', '2025-06-24 23:43:36'),
(14, 'coef_bonus', '1', 'ضریب پاداش', '2025-06-22 20:47:33', '2025-06-24 23:43:36'),
(45, 'deviceTimeout', '10000', 'زمان انتظار اتصال به دستگاه (میلی‌ثانیه)', '2025-06-22 22:25:40', '2025-06-22 22:25:40'),
(46, 'deviceInport', '5200', 'پورت داخلی دستگاه', '2025-06-22 22:25:40', '2025-06-22 22:25:40'),
(51, 'monthly_work_hours', '176', 'ساعات کاری ماهانه (22 روز × 8 ساعت)', '2025-06-22 22:25:40', '2025-06-22 22:25:40'),
(321, 'holiday_2025-07-03', 'تستی', 'تعطیل رسمی - 2025-07-03', '2025-06-24 23:31:56', '2025-06-24 23:31:56');

-- --------------------------------------------------------

--
-- Table structure for table `shifts`
--

CREATE TABLE `shifts` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `start_time` time NOT NULL,
  `end_time` time NOT NULL,
  `color` varchar(7) DEFAULT '#007bff',
  `work_hours` decimal(4,2) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `shifts`
--

INSERT INTO `shifts` (`id`, `name`, `start_time`, `end_time`, `color`, `work_hours`, `is_active`, `created_at`, `updated_at`) VALUES
(1, 'صبح', '08:34:00', '10:39:00', '#5e72e4', 2.08, 1, '2025-06-22 01:04:32', '2025-06-22 01:04:32'),
(2, 'چاشت ', '13:00:00', '17:00:00', '#5e72e4', 4.00, 0, '2025-06-22 11:08:04', '2025-06-23 12:08:58'),
(3, 'چاشت ', '13:00:00', '17:00:00', '#041b07', 4.00, 1, '2025-06-23 12:09:40', '2025-06-23 12:09:40'),
(4, 'چاشت ا', '07:00:00', '09:00:00', '#5e72e4', 2.00, 1, '2025-06-23 19:15:00', '2025-06-23 19:15:00'),
(5, 'ااا', '03:56:00', '05:52:00', '#5e72e4', 1.93, 1, '2025-06-24 23:22:42', '2025-06-24 23:22:42');

-- --------------------------------------------------------

--
-- Table structure for table `shift_assignments`
--

CREATE TABLE `shift_assignments` (
  `id` int(11) NOT NULL,
  `user_id` varchar(255) NOT NULL,
  `shift_id` int(11) NOT NULL,
  `assigned_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `is_active` tinyint(1) DEFAULT 1,
  `start_date` date DEFAULT NULL,
  `end_date` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `shift_assignments`
--

INSERT INTO `shift_assignments` (`id`, `user_id`, `shift_id`, `assigned_at`, `is_active`, `start_date`, `end_date`) VALUES
(1, '2', 1, '2025-06-22 01:04:46', 1, NULL, NULL),
(2, '7', 2, '2025-06-22 11:10:49', 0, NULL, NULL),
(3, '7', 1, '2025-06-22 11:11:00', 0, NULL, NULL),
(4, '10', 2, '2025-06-22 21:59:37', 1, '2025-06-23', '2025-06-28'),
(5, '43', 5, '2025-06-24 23:23:02', 1, '2025-06-25', '2025-06-26');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `user_id` varchar(255) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `role` int(11) DEFAULT NULL,
  `cardno` varchar(255) DEFAULT NULL,
  `province` varchar(100) DEFAULT NULL,
  `district` varchar(100) DEFAULT NULL,
  `salary` decimal(10,2) DEFAULT NULL,
  `shift` varchar(50) DEFAULT NULL,
  `department` varchar(100) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `address` text DEFAULT NULL,
  `hire_date` date DEFAULT NULL,
  `position` varchar(100) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `device_uid` int(11) DEFAULT NULL,
  `user_type` enum('admin','staff','personnel') DEFAULT 'personnel',
  `device_user_id` varchar(50) DEFAULT NULL,
  `device_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`user_id`, `name`, `password`, `role`, `cardno`, `province`, `district`, `salary`, `shift`, `department`, `phone`, `email`, `address`, `hire_date`, `position`, `created_at`, `updated_at`, `device_uid`, `user_type`, `device_user_id`, `device_id`) VALUES
('1', 'yaser left', '123456', 2, '0', 'هرات', 'کلاته خلیل', 20000.00, 'صبح', 'اداری', '0702008454', 'yaserfaqiri9@gmail.com', '64 متره ', NULL, NULL, '2025-06-21 22:36:09', '2025-06-25 13:15:15', 1, 'personnel', NULL, NULL),
('10', 'pplus2', '', 0, '0', 'کابل', 'مرکز ', 69998.00, '', 'مالی', '070707090', 'yaserfaqiri7@gmail.com', '', NULL, NULL, '2025-06-22 21:52:49', '2025-06-25 13:15:15', 10, 'personnel', NULL, NULL),
('12', 'X9Y[', '123456', 0, '0', 'کابل', 'مرکز ', 122222.00, 'عصر', 'اداری', '070707070', 'yaserfaqiri7@gmail.com', 'fdfd', '2025-06-23', NULL, '2025-06-23 16:33:37', '2025-06-25 13:15:15', 12, 'personnel', NULL, NULL),
('13', 'adminy', '$2b$10$gWXdjxfDdw2L0g7/dOizaOA9Gvm3kJxOYo4N4tMNhIiOZ4isc2GAe', 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-06-23 22:17:26', '2025-06-23 22:17:26', NULL, 'personnel', NULL, NULL),
('14', '[X\'X3X1 YY[X1[', '', 14, '0', 'هرات', 'گذره', 90000.00, 'چاشت ا', 'اداری', '0793442006', 'yaserfaqiri8@gmail.com', '', '2025-06-24', NULL, '2025-06-23 22:28:50', '2025-06-25 13:15:15', 14, 'personnel', NULL, NULL),
('16', 'test62', '', 0, '0', '', '', 33333.00, 'چاشت ', 'مالی', '', '', '', '2025-06-25', NULL, '2025-06-24 22:12:15', '2025-06-25 13:15:15', 16, 'personnel', NULL, NULL),
('2', 'yaser right', '123456', 2, '0', '', '', 0.00, '', '', '', '', '', NULL, NULL, '2025-06-21 22:36:09', '2025-06-25 13:15:15', 2, 'personnel', NULL, NULL),
('222', 'bagir', '', 0, '43', 'کابل', 'مرکز ', 77800.00, 'ااا', 'مالی', '', 'yaserfaqiri7@gmail.com', '', '2025-06-24', NULL, '2025-06-24 23:51:29', '2025-06-25 13:15:15', 222, 'personnel', NULL, NULL),
('3', 'yaserfaqiri', '', 0, '2323', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-06-21 22:36:09', '2025-06-25 13:15:15', 3, 'personnel', NULL, NULL),
('4', '.Ali ahmad', '', 2, '0', 'هرات', 'گذره', 30000.00, 'صبح', 'اداری', '0793442006', 'yaserfaqiri8@gmail.com', 'a', NULL, NULL, '2025-06-21 22:36:09', '2025-06-25 13:15:15', 4, 'personnel', NULL, NULL),
('411', 'test333', '', 0, '3', '', '', 23000.00, 'صبح', '', '', '', '', '2025-06-24', NULL, '2025-06-25 00:03:48', '2025-06-25 13:15:15', 411, 'personnel', NULL, NULL),
('424', 'yas', '2b10xClo', 14, '424', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-06-25 12:50:00', '2025-06-25 13:15:15', 424, 'personnel', NULL, NULL),
('425', 'yas2', '2b10oR0m', 0, '425', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-06-25 12:50:00', '2025-06-25 13:15:15', 425, 'personnel', NULL, NULL),
('426', 'yas3', '2b10Ma6L', 14, '426', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-06-25 12:50:00', '2025-06-25 13:15:15', 426, 'personnel', NULL, NULL),
('427', 'karar adi', '2b103WUF', 0, '427', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-06-25 13:17:38', '2025-06-25 13:17:38', 427, 'personnel', NULL, NULL),
('428', 'karar adi', '2b10YDkN', 0, '428', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-06-25 13:17:38', '2025-06-25 13:17:38', 428, 'personnel', NULL, NULL),
('429', 'karar adi', '2b10fCOy', 0, '429', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-06-25 13:19:57', '2025-06-25 13:19:57', 429, 'personnel', NULL, NULL),
('43', 'test625555', '123456', 0, '654', '', '', 23.00, 'صبح', '', '', '', '', '2025-06-25', NULL, '2025-06-24 23:11:10', '2025-06-25 13:15:15', 43, 'personnel', NULL, NULL),
('430', 'karar adi', '2b10znpB', 14, '430', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-06-25 13:19:57', '2025-06-25 13:19:57', 430, 'personnel', NULL, NULL),
('431', 'karar adi', '2b10q37c', 0, '431', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-06-25 15:04:12', '2025-06-25 15:04:12', 431, 'personnel', NULL, NULL),
('432', 'karar admin', '2b10Q3DW', 14, '432', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-06-25 15:04:12', '2025-06-25 15:04:12', 432, 'personnel', NULL, NULL),
('433', 'gimz band', '2b10NyZg', 14, '433', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-06-25 15:16:53', '2025-06-25 15:16:53', 433, 'personnel', NULL, NULL),
('434', 'gimz band', '2b10te7j', 0, '434', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-06-25 15:16:53', '2025-06-25 15:16:53', 434, 'personnel', NULL, NULL),
('435', 'ali ahmad jan', '2b10uhun', 14, '435', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-06-25 15:27:41', '2025-06-25 15:27:41', 435, 'personnel', NULL, NULL),
('5', 'zmahdi', '', 0, '33', '', '', 0.00, '', '', '', '', '', NULL, NULL, '2025-06-21 22:36:09', '2025-06-25 13:15:15', 5, 'personnel', NULL, NULL),
('6', 'X\'X-YX/ X:YX\'Y[', '123456', 0, '1', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-06-21 22:36:09', '2025-06-25 13:15:15', 6, 'personnel', NULL, NULL),
('7', 'Ali ahmad', '123456', 1, '0', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-06-21 22:36:09', '2025-06-25 13:15:15', 7, 'personnel', NULL, NULL),
('8', 'test', '123456', 0, '0', 'کابل', 'مرکز ', 20000.00, 'عصر', 'مالی', '070707070', 'yaserfaqiri7@gmail.com', 'تست', '2025-06-22', NULL, '2025-06-22 17:59:50', '2025-06-25 13:15:15', 8, 'personnel', NULL, NULL),
('9', 'pplus', '', 0, '0', 'کابل', 'مرکز ', 8000.00, 'صبح ', 'مالی', '070707070', 'yaserfaqiri7@gmail.com', 'ا', '2025-06-16', NULL, '2025-06-22 21:36:14', '2025-06-22 21:36:14', NULL, 'personnel', NULL, NULL),
('admin', '�.د�Oر س�Oست�.', '$2a$12$SFLuONKuVT7FwAQ8oouNDOyUIgsNi.mU5iQfovUSfvJMgY96CQ0Py', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'admin@example.com', NULL, NULL, NULL, '2025-06-22 22:26:29', '2025-06-22 22:26:29', NULL, 'personnel', NULL, NULL),
('PERS001', 'haji yaser faqiri3', '', 2, '0', 'کابل', 'مرکز ', 3400.00, 'صبح', 'مالی', '', '', '', '2025-06-25', NULL, '2025-06-25 09:53:03', '2025-06-25 13:15:15', 416, 'personnel', NULL, NULL),
('PERS002', 'off', '', 2, '0', '', '', 55555.00, 'چاشت ', '', '', '', '', '2025-06-25', NULL, '2025-06-25 10:47:29', '2025-06-25 13:15:15', 419, 'personnel', NULL, NULL),
('PERS003', 'c', '', 2, '0', '', '', 99.00, '', '', '', '', '', '2025-06-24', NULL, '2025-06-25 10:58:32', '2025-06-25 13:15:15', 417, 'personnel', NULL, NULL),
('PERS004', 'efghij', '', 2, '0', '', '', 6556.00, '', '', '', '', '', NULL, NULL, '2025-06-25 10:59:22', '2025-06-25 13:15:15', 418, 'personnel', NULL, NULL),
('PERS005', 'tamam3', '', 2, '0', '', '', 8900.00, '', '', '', '', '', '2025-06-25', NULL, '2025-06-25 11:37:20', '2025-06-25 13:15:15', 420, 'personnel', NULL, NULL),
('PERS006', 'tamam personal', '', 2, '0', '', '', 3444.00, '', '', '', '', '', '2025-06-24', NULL, '2025-06-25 11:38:19', '2025-06-25 13:15:15', 421, 'personnel', NULL, NULL),
('PERS007', 'mad2', '', 2, '0', '', '', 1234.00, 'صبح', '', '', '', '', '2025-06-19', NULL, '2025-06-25 12:30:55', '2025-06-25 13:15:15', 422, 'personnel', NULL, NULL),
('PERS008', 'test1234', '', 2, '0', '', '', 333333.00, 'صبح', '', '', '', '', '2025-06-25', NULL, '2025-06-25 12:38:24', '2025-06-25 13:15:15', 423, 'personnel', NULL, NULL),
('PERS009', 'yas5', '', 0, '0', 'کابل', '', 4444.00, 'صبح', 'مالی', '', '', '', '2025-06-25', NULL, '2025-06-25 12:49:53', '2025-06-25 13:15:15', 9, 'personnel', NULL, NULL),
('PERS010', 'karar adi', '', 2, '0', '', '', 6666.00, '', '', '', '', '', NULL, NULL, '2025-06-25 13:18:05', '2025-06-25 13:19:57', 10, 'personnel', NULL, NULL),
('PERS011', 'karar personal', '', 2, '0', '', '', 668.00, 'چاشت ', 'مالی', '', '', '', '2025-06-25', NULL, '2025-06-25 13:21:21', '2025-06-25 13:21:21', 11, 'personnel', NULL, NULL),
('PERS012', 'gimz band', '', 2, '0', '', '', 89070.00, 'چاشت ', '', '', '', '', NULL, NULL, '2025-06-25 15:13:52', '2025-06-25 15:16:53', 12, 'personnel', NULL, NULL),
('test123', 'Test User', '', 0, '0', NULL, NULL, 23000.00, 'صبح', 'تست', NULL, NULL, NULL, NULL, NULL, '2025-06-25 00:04:44', '2025-06-25 13:15:15', 412, 'personnel', NULL, NULL),
('USER001', 'ali', '$2b$10$thk6Q9v5sNMOu4cZM6YJ3O2HJGlghjuhKplnpPYJKvjeuWyUsqMrK', 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-06-23 22:36:16', '2025-06-23 22:36:16', NULL, 'personnel', NULL, NULL),
('USER002', 'ali2', '', 0, '0', '', '', 44444.00, '', '', '', '', '', NULL, NULL, '2025-06-23 22:40:10', '2025-06-25 13:15:15', 413, 'personnel', NULL, NULL),
('USER003', 'haji yaser faqiri', '123456', 14, '0', 'کابل', 'مرکز ', 4500.00, 'صبح', 'مالی', '', '', '', '2025-06-25', NULL, '2025-06-25 09:51:52', '2025-06-25 13:15:15', 414, 'personnel', NULL, NULL),
('USER004', 'haji yaser faqiri2', '123456', 0, '0', '', '', 3500.00, 'چاشت ', 'مالی', '', '', '', '2025-06-25', NULL, '2025-06-25 09:52:32', '2025-06-25 13:15:15', 415, 'personnel', NULL, NULL),
('USER005', 'off', '$2b$10$NV8oVztqhXtEa5QaQC4hY.3XJ.HiOxCmdlFdwlKSvBD4lhfevD7hS', 14, '0', '', '', 55555.00, 'چاشت ', '', '', '', '', '2025-06-25', NULL, '2025-06-25 10:47:20', '2025-06-25 10:47:22', NULL, 'personnel', NULL, NULL),
('USER006', 'a', '$2b$10$.SqdJ6ltt7T0duYDtxnfD.XX.so7PYCCMYdeRABkXnd81pn6ysZuC', 0, '0', '', '', 99.00, '', '', '', '', '', '2025-06-24', NULL, '2025-06-25 10:56:04', '2025-06-25 10:56:04', NULL, 'personnel', NULL, NULL),
('USER007', 'b', '$2b$10$z3iEOfRP5F1NkXuAWoDXrOqA0nztE94setQ//32duMkD14a4SMp0G', 14, '0', '', '', 99.00, '', '', '', '', '', '2025-06-10', NULL, '2025-06-25 10:57:23', '2025-06-25 10:57:23', NULL, 'personnel', NULL, NULL),
('USER008', 'il', '$2b$10$XbLe/55N6Hf7ezk5qEUqbOw7kAs59Z.rt5MenCD89QAuxaVj4m8ki', 14, '55', 'کابل', 'مرکز ', 555.00, 'چاشت ', 'مالی', '', '', '55', '2025-06-25', NULL, '2025-06-25 11:00:08', '2025-06-25 11:00:08', NULL, 'personnel', NULL, NULL),
('USER009', 'finish', '$2b$10$bOjGlyXRwQ3qsexeiVnygOEtWAB4ITxNXFq0iTd/nplhFPFDvW0Ba', 14, '0', 'کابل', '', 77777.00, 'ااا', 'مالی', '', '', '', '2025-06-25', NULL, '2025-06-25 11:09:05', '2025-06-25 11:09:05', NULL, 'personnel', NULL, NULL),
('USER010', 'finish2', '$2b$10$cArBeuxpQDxGUCzOUQY.1uD2k2NPRSCyxOdjCDPMLoOSfJMRJM8b6', 14, '0', '', '', 77777.00, '', '', '', '', '', '2025-06-04', NULL, '2025-06-25 11:09:43', '2025-06-25 11:09:43', NULL, 'personnel', NULL, NULL),
('USER011', '????? ???', '$2b$10$URil3YFzyavjxlYK9GxMye8BY4O3yMa4/Yvcljfg.Z6mln15eY7rW', 0, '0', NULL, NULL, 10000.00, '???', '???', NULL, NULL, NULL, NULL, NULL, '2025-06-25 11:13:03', '2025-06-25 11:13:03', NULL, 'personnel', NULL, NULL),
('USER012', 'finish3', '$2b$10$N.ORwYFnxSpYmhOc/GpWj.MOE9AhFbvl7/c7pJ8ceGcKwLTJlIA1S', 14, '0', '', '', 55555.00, '', '', '', '', '', '2025-06-24', NULL, '2025-06-25 11:15:16', '2025-06-25 11:15:16', NULL, 'personnel', NULL, NULL),
('USER013', 'finish66', '$2b$10$y2aMr27mj8LfBgeOdFIQqOptyyd5lCdd/20JEjFzYAQfqhP91rYi6', 14, '0', '', '', 3333.00, 'چاشت ا', '', '', '', '', '2025-06-25', NULL, '2025-06-25 11:21:52', '2025-06-25 11:21:52', NULL, 'personnel', NULL, NULL),
('USER014', 'curl', '$2b$10$BagTWqaWIVEuSoJ4QuLfiechkuyEI1ifUYSRr4r2H4CK1k4F/GWri', 14, '0', '', '', 123456.00, 'چاشت ', '', '', '', '', '2025-06-25', NULL, '2025-06-25 11:25:36', '2025-06-25 11:25:36', NULL, 'personnel', NULL, NULL),
('USER015', 'wwww', '$2b$10$DYutMk7LUkOlunPMjJd6m.FYa/fLaEcC4MFIsl.HKuDfbQxyfYI9.', 14, '0', '', '', 50000.00, 'چاشت ', '', '', '', '', '2025-06-24', NULL, '2025-06-25 11:28:49', '2025-06-25 11:28:49', NULL, 'personnel', NULL, NULL),
('USER016', 'tamam', '$2b$10$9.P8/75Hdl8zgaJOM6r.SOuJ7SLFfbmWYaktNalRwVmgTi8RUV9kG', 14, '0', '', '', 2300.00, '', '', '', '', '', '2025-06-25', NULL, '2025-06-25 11:34:44', '2025-06-25 11:34:44', NULL, 'personnel', NULL, NULL),
('USER017', 'tamam2', '$2b$10$tfR7oDAOdvW3JGJL5qGrCObXFkHe17ieZxUD6NFG9Pw/6UHvLhCAG', 0, '0', 'کابل', '', 2400.00, 'ااا', 'مالی', '', '', '', '2025-06-25', NULL, '2025-06-25 11:36:35', '2025-06-25 11:36:35', NULL, 'personnel', NULL, NULL),
('USER018', 'ali ahmad4', '$2b$10$3LKCWhG3ABCZ2.yWR7xWIOdTIDMaODwqeolgelJ1K1F7lHIOPgcbG', 14, '0', '', '', 55555.00, 'ااا', '', '', '', '', '2025-06-25', NULL, '2025-06-25 11:47:32', '2025-06-25 11:47:40', NULL, 'personnel', NULL, NULL),
('USER019', 'test67', '$2b$10$Fl12dBRZdVgUiJcIoN02de16IJVgOuBwjjHVpKB2LmN9Xa7j4Gph.', 14, '0', '', '', 78990.00, 'صبح', '', '', '', '', '2025-06-25', NULL, '2025-06-25 12:24:22', '2025-06-25 12:24:22', NULL, 'personnel', NULL, NULL),
('USER020', 'mad', '$2b$10$qfUZWRWXqh67vlyWfcSh2.CVY2BgSTkcvjZ.Yp6Odd3tIuezi2dbe', 14, '0', 'کابل', '', 1233.00, 'چاشت ', '', '', '', '', '2025-06-19', NULL, '2025-06-25 12:30:36', '2025-06-25 12:30:36', NULL, 'personnel', NULL, NULL),
('USER021', 'mad3', '$2b$10$/4c9Gkf2UUdN7fFZBCuuhO.AZZhgZeRmJvLuRij.IWSHVaDGuaIuW', 0, '0', '', 'مرکز ', 1234.00, 'چاشت ', '', '', '', '', '2025-06-25', NULL, '2025-06-25 12:31:26', '2025-06-25 12:31:26', NULL, 'personnel', NULL, NULL),
('USER022', 'test1234', '$2b$10$0AvSHkQfXt5EYE33aUqDNOgwpiHkjKaohStxZqbtpKx278TlF.fv6', 14, '0', '', '', 22222.00, 'صبح', '', '', '', '', '2025-06-18', NULL, '2025-06-25 12:37:51', '2025-06-25 12:37:51', NULL, 'personnel', NULL, NULL),
('USER023', 'yas', '$2b$10$xCloWARw0hxGQRrdSN8xp.D/v.uTbEm2BqpJfv6SxfBzle9knyQwO', 14, '0', '', '', 5555.00, 'صبح', '', '', '', '', '2025-06-17', NULL, '2025-06-25 12:46:03', '2025-06-25 12:46:03', NULL, 'personnel', NULL, NULL),
('USER024', 'yas2', '$2b$10$oR0mq5ET.ZztPx1Q.98WS.Mwo5nEL6wSzV0hsvLRolt69M44N4yBW', 0, '0', 'کابل', '', 2222.00, 'چاشت ', 'مالی', '', '', '', '2025-06-24', NULL, '2025-06-25 12:48:59', '2025-06-25 12:48:59', NULL, 'personnel', NULL, NULL),
('USER025', 'yas3', '$2b$10$Ma.6LoHJAabq0DaKGx3qJ.GR8uzQk/wcAP.4mLnwjFyFJRH1k8/N2', 14, '0', 'کابل', '', 3434.00, 'صبح', '', '', '', '', '0000-00-00', NULL, '2025-06-25 12:49:26', '2025-06-25 12:49:26', NULL, 'personnel', NULL, NULL),
('USER026', 'karar adi', '$2b$10$3WUFZSSrPK2mfmz6nS6LluIb/CTwHqrIfzTs2Qy5OeDlkfwJG3TR2', 0, '0', 'کابل', '', 2300.00, 'چاشت ', '', '', '', '', '2025-06-25', NULL, '2025-06-25 13:16:30', '2025-06-25 13:16:30', 427, 'personnel', NULL, NULL),
('USER027', 'karar adi', '$2b$10$YDkNjumHr613qn2asyV3Q.G1Ots2qaQ9G0Yzh4Uxsf6grpMCMCbAC', 0, '0', 'کابل', '', 2300.00, 'چاشت ', '', '', '', '', '2025-06-25', NULL, '2025-06-25 13:17:01', '2025-06-25 13:17:01', 428, 'personnel', NULL, NULL),
('USER028', 'karar adi', '$2b$10$fCOyxumcxRYX7.8nfV/T/OJSQC.BHO3JfJnURli/GBVn/SLd5SC7y', 0, '0', '', '', 6666.00, '', '', '', '', '', '0000-00-00', NULL, '2025-06-25 13:17:54', '2025-06-25 13:17:54', 429, 'personnel', NULL, NULL),
('USER029', 'karar adi', '$2b$10$znpBSY28ZLJDsbHGpZn7L.M6Ml4uJseRmuJ.mDZmHSkjUQ75F3l1q', 14, '0', '', '', 6666.00, '', '', '', '', '', '0000-00-00', NULL, '2025-06-25 13:17:59', '2025-06-25 13:17:59', 430, 'personnel', NULL, NULL),
('USER030', 'karar adi', '$2b$10$q37cFKpf9LkHVM9j/MxzCOKOQwJ1WVGfUU2BvezC80LvpQ5E4ur1q', 0, '0', '', '', 666.00, '', '', '', '', '', '0000-00-00', NULL, '2025-06-25 13:20:25', '2025-06-25 13:20:25', 431, 'personnel', NULL, NULL),
('USER031', 'karar admin', '$2b$10$Q3DW0fSBF1UDTC0VQqYWkOwyzl9r8ogTBLdfJ06gskdEYbQS8uA/q', 14, '0', '', '', 667.00, '', 'مالی', '', '', '', '0000-00-00', NULL, '2025-06-25 13:20:50', '2025-06-25 13:20:50', 432, 'personnel', NULL, NULL),
('USER032', 'gimz band', '$2b$10$NyZgV7OdrraAYcanxxUgXOr3NIxAizCV1j7Wb44sZemOUhfXYMoJS', 14, '0', '', '', 34000.00, '', '', '', '', '', '0000-00-00', NULL, '2025-06-25 15:08:27', '2025-06-25 15:08:27', 433, 'personnel', NULL, NULL),
('USER033', 'gimz band', '$2b$10$te7j/XFLoVDyCHcg01aZZeW/n8RFa51T.f.ZONJJaXIFjKk0Yzxwi', 0, '0', '', '', 90000.00, '', '', '', '', '', '0000-00-00', NULL, '2025-06-25 15:10:51', '2025-06-25 15:10:51', 434, 'personnel', NULL, NULL),
('USER034', 'ali ahmad jan', '$2b$10$uhunpsaIaZAQEKCypI6IuennxlnBQuviVSRVMPVC1Ea6siCzagVhi', 14, '0', '', '', 5335.00, '', '', '', '', '', '0000-00-00', NULL, '2025-06-25 15:27:28', '2025-06-25 15:27:28', 435, 'personnel', NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `work_times`
--

CREATE TABLE `work_times` (
  `id` int(11) NOT NULL,
  `user_id` varchar(255) NOT NULL,
  `date` date NOT NULL,
  `overtime_hours` decimal(5,2) DEFAULT 0.00,
  `undertime_hours` decimal(5,2) DEFAULT 0.00,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `type` enum('manual','auto') DEFAULT 'manual'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `work_times`
--

INSERT INTO `work_times` (`id`, `user_id`, `date`, `overtime_hours`, `undertime_hours`, `created_at`, `type`) VALUES
(1, '7', '2025-06-17', 0.21, 0.03, '2025-06-22 17:15:37', 'auto'),
(2, '7', '2025-06-17', 0.21, 0.03, '2025-06-22 17:15:51', 'manual'),
(3, '1', '2025-06-12', 0.53, 0.03, '2025-06-22 17:16:02', 'manual'),
(4, '5', '2025-06-22', 1.55, 0.21, '2025-06-22 17:16:53', 'manual'),
(5, '5', '2025-06-05', 0.04, 0.00, '2025-06-22 17:19:10', 'manual'),
(6, '6', '2025-06-22', 5.00, 0.23, '2025-06-22 17:19:37', 'auto'),
(7, '1', '2025-06-25', 55.00, 5.00, '2025-06-22 17:24:53', 'auto'),
(8, '8', '2025-06-22', 3.00, 1.00, '2025-06-22 18:00:47', 'auto'),
(9, '4', '2025-06-01', 1.00, 0.00, '2025-06-23 13:36:18', 'manual'),
(10, '4', '2025-06-01', 0.00, 0.00, '2025-06-23 13:38:07', 'manual'),
(11, '8', '2025-06-01', 3.00, 1.00, '2025-06-24 23:43:44', 'manual'),
(12, '8', '2025-06-01', 3.00, 1.00, '2025-06-24 23:43:45', 'manual'),
(13, '8', '2025-06-01', 3.00, 1.00, '2025-06-24 23:43:47', 'manual'),
(14, '6', '2025-06-01', 5.00, 0.23, '2025-06-24 23:52:19', 'manual');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `attendances`
--
ALTER TABLE `attendances`
  ADD PRIMARY KEY (`id`),
  ADD KEY `device_id` (`device_id`);

--
-- Indexes for table `devices`
--
ALTER TABLE `devices`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `leaves`
--
ALTER TABLE `leaves`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `notifications`
--
ALTER TABLE `notifications`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `pending_device_users`
--
ALTER TABLE `pending_device_users`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `salaries`
--
ALTER TABLE `salaries`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `settings`
--
ALTER TABLE `settings`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `setting_key` (`setting_key`);

--
-- Indexes for table `shifts`
--
ALTER TABLE `shifts`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `shift_assignments`
--
ALTER TABLE `shift_assignments`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_assignment` (`user_id`,`shift_id`),
  ADD KEY `shift_id` (`shift_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`),
  ADD KEY `device_id` (`device_id`);

--
-- Indexes for table `work_times`
--
ALTER TABLE `work_times`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `attendances`
--
ALTER TABLE `attendances`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=130;

--
-- AUTO_INCREMENT for table `devices`
--
ALTER TABLE `devices`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `leaves`
--
ALTER TABLE `leaves`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `notifications`
--
ALTER TABLE `notifications`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `pending_device_users`
--
ALTER TABLE `pending_device_users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `salaries`
--
ALTER TABLE `salaries`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=41;

--
-- AUTO_INCREMENT for table `settings`
--
ALTER TABLE `settings`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=406;

--
-- AUTO_INCREMENT for table `shifts`
--
ALTER TABLE `shifts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `shift_assignments`
--
ALTER TABLE `shift_assignments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `work_times`
--
ALTER TABLE `work_times`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `attendances`
--
ALTER TABLE `attendances`
  ADD CONSTRAINT `attendances_ibfk_1` FOREIGN KEY (`device_id`) REFERENCES `devices` (`id`);

--
-- Constraints for table `leaves`
--
ALTER TABLE `leaves`
  ADD CONSTRAINT `leaves_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE;

--
-- Constraints for table `notifications`
--
ALTER TABLE `notifications`
  ADD CONSTRAINT `notifications_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE;

--
-- Constraints for table `salaries`
--
ALTER TABLE `salaries`
  ADD CONSTRAINT `salaries_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE;

--
-- Constraints for table `shift_assignments`
--
ALTER TABLE `shift_assignments`
  ADD CONSTRAINT `shift_assignments_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `shift_assignments_ibfk_2` FOREIGN KEY (`shift_id`) REFERENCES `shifts` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `users_ibfk_1` FOREIGN KEY (`device_id`) REFERENCES `devices` (`id`);

--
-- Constraints for table `work_times`
--
ALTER TABLE `work_times`
  ADD CONSTRAINT `work_times_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
