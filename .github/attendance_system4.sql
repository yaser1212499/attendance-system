-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jun 22, 2025 at 05:06 PM
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
  `timestamp` datetime NOT NULL,
  `type` enum('ورود','خروج') NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `device_id` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `attendances`
--

INSERT INTO `attendances` (`id`, `user_id`, `timestamp`, `type`, `created_at`, `device_id`) VALUES
(1, '4', '2025-06-17 06:53:48', 'ورود', '2025-06-21 20:10:21', NULL),
(2, '2', '2025-06-17 07:14:23', 'ورود', '2025-06-21 20:10:21', NULL),
(3, '2', '2025-06-17 07:14:25', 'خروج', '2025-06-21 20:10:21', NULL),
(4, '2', '2025-06-17 07:14:27', 'ورود', '2025-06-21 20:10:21', NULL),
(5, '2', '2025-06-17 07:14:29', 'خروج', '2025-06-21 20:10:21', NULL),
(6, '1', '2025-06-17 08:05:52', 'ورود', '2025-06-21 20:10:21', NULL),
(7, '1', '2025-06-17 08:06:05', 'خروج', '2025-06-21 20:10:21', NULL),
(8, '2', '2025-06-17 08:47:26', 'ورود', '2025-06-21 20:10:21', NULL),
(9, '2', '2025-06-17 08:47:28', 'خروج', '2025-06-21 20:10:21', NULL),
(10, '2', '2025-06-17 10:48:56', 'ورود', '2025-06-21 20:10:21', NULL),
(11, '2', '2025-06-17 10:48:59', 'خروج', '2025-06-21 20:10:21', NULL),
(12, '1', '2025-06-17 10:49:02', 'ورود', '2025-06-21 20:10:21', NULL),
(13, '2', '2025-06-18 02:06:36', 'ورود', '2025-06-21 20:10:21', NULL),
(14, '2', '2025-06-18 02:06:39', 'خروج', '2025-06-21 20:10:21', NULL),
(15, '1', '2025-06-18 02:07:35', 'خروج', '2025-06-21 20:10:21', NULL),
(16, '1', '2025-06-18 02:07:39', 'ورود', '2025-06-21 20:10:21', NULL),
(17, '1', '2025-06-18 03:28:40', 'خروج', '2025-06-21 20:10:21', NULL),
(18, '1', '2025-06-18 03:28:42', 'ورود', '2025-06-21 20:10:21', NULL),
(19, '1', '2025-06-18 03:55:29', 'خروج', '2025-06-21 20:10:21', NULL),
(20, '1', '2025-06-18 03:55:31', 'ورود', '2025-06-21 20:10:21', NULL),
(21, '1', '2025-06-18 04:01:16', 'خروج', '2025-06-21 20:10:21', NULL),
(22, '1', '2025-06-18 04:10:46', 'ورود', '2025-06-21 20:10:21', NULL),
(23, '4', '2025-06-18 05:30:59', 'خروج', '2025-06-21 20:10:21', NULL),
(24, '1', '2025-06-18 07:10:27', 'خروج', '2025-06-21 20:10:21', NULL),
(25, '2', '2025-06-18 07:21:04', 'ورود', '2025-06-21 20:10:21', NULL),
(26, '1', '2025-06-18 07:22:26', 'ورود', '2025-06-21 20:10:21', NULL),
(27, '1', '2025-06-18 07:22:28', 'خروج', '2025-06-21 20:10:21', NULL),
(28, '2', '2025-06-19 11:37:19', 'خروج', '2025-06-21 20:10:21', NULL),
(29, '2', '2025-06-19 11:37:23', 'ورود', '2025-06-21 20:10:21', NULL),
(30, '1', '2025-06-19 11:37:28', 'ورود', '2025-06-21 20:10:21', NULL),
(31, '1', '2025-06-19 11:37:31', 'خروج', '2025-06-21 20:10:21', NULL),
(32, '1', '2025-06-19 11:37:34', 'ورود', '2025-06-21 20:10:21', NULL),
(33, '2', '2025-06-21 08:36:22', 'خروج', '2025-06-21 20:10:21', NULL),
(34, '2', '2025-06-21 11:03:18', 'ورود', '2025-06-21 20:10:21', NULL),
(35, '2', '2025-06-21 11:03:21', 'خروج', '2025-06-21 20:10:21', NULL),
(36, '1', '2025-06-21 11:03:24', 'خروج', '2025-06-21 20:10:21', NULL),
(37, '2', '2025-06-21 11:49:05', 'ورود', '2025-06-21 20:10:21', NULL),
(38, '2', '2025-06-21 11:49:08', 'خروج', '2025-06-21 20:10:21', NULL),
(39, '1', '2025-06-21 11:49:11', 'ورود', '2025-06-21 20:10:21', NULL),
(40, '2', '2025-06-21 11:55:36', 'ورود', '2025-06-21 20:10:21', NULL),
(41, '2', '2025-06-21 11:55:38', 'خروج', '2025-06-21 20:10:21', NULL),
(42, '1', '2025-06-21 11:55:42', 'خروج', '2025-06-21 20:10:21', NULL),
(43, '2', '2025-06-21 12:05:31', 'ورود', '2025-06-21 20:10:21', NULL),
(44, '2', '2025-06-21 12:05:34', 'خروج', '2025-06-21 20:10:21', NULL),
(45, '1', '2025-06-21 12:05:36', 'ورود', '2025-06-21 20:10:21', NULL),
(46, '2', '2025-06-21 12:25:01', 'ورود', '2025-06-21 20:10:21', NULL),
(47, '2', '2025-06-21 12:25:04', 'خروج', '2025-06-21 20:10:21', NULL),
(48, '1', '2025-06-21 12:25:06', 'خروج', '2025-06-21 20:10:21', NULL),
(49, '1', '2025-06-21 13:35:20', 'ورود', '2025-06-21 21:06:48', NULL),
(50, '1', '2025-06-21 13:35:23', 'خروج', '2025-06-21 21:06:48', NULL),
(51, '2', '2025-06-21 13:35:30', 'ورود', '2025-06-21 21:06:48', NULL),
(52, '2', '2025-06-21 14:31:14', 'خروج', '2025-06-21 22:01:42', NULL),
(53, '2', '2025-06-21 14:31:16', 'ورود', '2025-06-21 22:01:43', NULL),
(54, '1', '2025-06-21 14:31:19', 'ورود', '2025-06-21 22:01:43', NULL),
(55, '2', '2025-06-21 14:41:12', 'خروج', '2025-06-21 22:11:47', NULL),
(56, '2', '2025-06-21 14:41:14', 'ورود', '2025-06-21 22:11:47', NULL),
(57, '2', '2025-06-21 14:41:17', 'خروج', '2025-06-21 22:11:47', NULL),
(58, '1', '2025-06-21 14:41:19', 'خروج', '2025-06-21 22:11:47', NULL),
(59, '1', '2025-06-21 14:41:22', 'ورود', '2025-06-21 22:11:47', NULL),
(60, '2', '2025-06-22 03:05:35', 'ورود', '2025-06-22 10:52:30', NULL),
(61, '2', '2025-06-22 03:05:37', 'خروج', '2025-06-22 10:52:30', NULL),
(62, '2', '2025-06-22 03:05:39', 'ورود', '2025-06-22 10:52:30', NULL),
(63, '2', '2025-06-22 03:05:41', 'خروج', '2025-06-22 10:52:30', NULL),
(64, '1', '2025-06-22 03:22:04', 'خروج', '2025-06-22 10:52:30', NULL),
(65, '4', '2025-06-22 03:22:49', 'ورود', '2025-06-22 10:52:44', NULL),
(66, '4', '2025-06-22 03:24:03', 'خروج', '2025-06-22 10:54:01', NULL),
(67, '4', '2025-06-22 03:24:14', 'ورود', '2025-06-22 10:54:11', NULL),
(68, '4', '2025-06-22 03:26:51', 'خروج', '2025-06-22 10:57:02', NULL),
(69, '4', '2025-06-22 03:29:35', 'ورود', '2025-06-22 11:00:04', NULL),
(70, '4', '2025-06-22 03:30:32', 'خروج', '2025-06-22 12:41:51', NULL),
(71, '1', '2025-06-22 03:32:56', 'ورود', '2025-06-22 12:41:51', NULL);

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
(1, '7', 'emergency', '2025-06-22', '2025-06-25', 4, 'تست', 'approved', '', '2025-06-22 11:22:19', '2025-06-22 11:23:07', NULL, NULL);

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
  `tax` decimal(15,2) DEFAULT 0.00,
  `bonus` decimal(15,2) DEFAULT 0.00,
  `deductions` decimal(15,2) DEFAULT 0.00,
  `payment_date` date DEFAULT NULL,
  `status` enum('pending','paid','failed') DEFAULT 'pending',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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
(10, 'deviceLocation', 'ورودی اصلی', 'تنظیمات دستگاه - deviceLocation', '2025-06-22 01:08:34', '2025-06-22 01:08:34');

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
(2, 'چاشت ', '13:00:00', '17:00:00', '#5e72e4', 4.00, 1, '2025-06-22 11:08:04', '2025-06-22 11:08:04');

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
(3, '7', 1, '2025-06-22 11:11:00', 0, NULL, NULL);

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
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`user_id`, `name`, `password`, `role`, `cardno`, `province`, `district`, `salary`, `shift`, `department`, `phone`, `email`, `address`, `hire_date`, `created_at`, `updated_at`) VALUES
('1', 'yaser left', '123456', 2, '0', 'هرات', 'کلاته خلیل', 20000.00, 'صبح', 'اداری', '0702008454', 'yaserfaqiri9@gmail.com', '64 متره ', '0000-00-00', '2025-06-21 22:36:09', '2025-06-22 11:03:33'),
('2', 'yaser right', '123456', 2, '0', '', '', 0.00, '', '', '', '', '', '0000-00-00', '2025-06-21 22:36:09', '2025-06-22 11:03:41'),
('3', 'yaserfaqiri', '', 0, '2323', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-06-21 22:36:09', '2025-06-21 22:36:09'),
('4', 'Ali ahmad', '123456', 2, '0', 'هرات', 'گذره', 30000.00, 'صبح', 'اداری', '0793442006', 'yaserfaqiri8@gmail.com', 'a', '0000-00-00', '2025-06-21 22:36:09', '2025-06-22 11:03:47'),
('5', 'mahdi', '123456', 0, '33', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-06-21 22:36:09', '2025-06-21 22:36:09'),
('6', 'X\'X-YX/ X:YX\'Y[', '123456', 0, '1', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-06-21 22:36:09', '2025-06-21 22:36:09'),
('7', 'Ali ahmad', '123456', 1, '0', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-06-21 22:36:09', '2025-06-21 22:36:09');

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
  `type` enum('manual','auto') DEFAULT 'manual',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `attendances`
--
ALTER TABLE `attendances`
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
  ADD PRIMARY KEY (`user_id`);

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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=72;

--
-- AUTO_INCREMENT for table `leaves`
--
ALTER TABLE `leaves`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `notifications`
--
ALTER TABLE `notifications`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `salaries`
--
ALTER TABLE `salaries`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `settings`
--
ALTER TABLE `settings`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `shifts`
--
ALTER TABLE `shifts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `shift_assignments`
--
ALTER TABLE `shift_assignments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `work_times`
--
ALTER TABLE `work_times`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

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
-- Constraints for table `work_times`
--
ALTER TABLE `work_times`
  ADD CONSTRAINT `work_times_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
