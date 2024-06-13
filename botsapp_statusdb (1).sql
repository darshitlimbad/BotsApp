-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jun 13, 2024 at 07:08 PM
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
-- Database: `botsapp_statusdb`
--

-- --------------------------------------------------------

--
-- Table structure for table `messages`
--

CREATE TABLE `messages` (
  `id` int(11) NOT NULL,
  `msgID` varchar(20) NOT NULL,
  `status` varchar(10) NOT NULL DEFAULT 'uploading',
  `seenByIDs` text DEFAULT NULL,
  `hide` int(1) NOT NULL DEFAULT 0,
  `hide_by` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `messages`
--

INSERT INTO `messages` (`id`, `msgID`, `status`, `seenByIDs`, `hide`, `hide_by`) VALUES
(2, 'Msg00000002', 'read', 'a:2:{i:0;s:12:\"User00000001\";i:1;s:12:\"User00000003\";}', 0, NULL),
(4, 'Msg00000004', 'read', 'a:2:{i:0;s:12:\"User00000001\";i:1;s:12:\"User00000003\";}', 0, NULL),
(6, 'Msg00000006', 'read', 'a:2:{i:0;s:12:\"User00000001\";i:1;s:12:\"User00000002\";}', 0, NULL),
(8, 'Msg00000008', 'read', 'a:2:{i:0;s:12:\"User00000001\";i:1;s:12:\"User00000002\";}', 0, NULL),
(9, 'Msg00000009', 'read', 'a:2:{i:0;s:12:\"User00000001\";i:1;s:12:\"User00000002\";}', 0, NULL),
(10, 'Msg00000010', 'read', 'a:2:{i:0;s:12:\"User00000001\";i:1;s:12:\"User00000002\";}', 0, NULL),
(12, 'Msg00000012', 'read', 'a:2:{i:0;s:12:\"User00000001\";i:1;s:12:\"User00000002\";}', 0, NULL),
(13, 'Msg00000013', 'read', 'a:2:{i:0;s:12:\"User00000002\";i:1;s:12:\"User00000001\";}', 0, NULL),
(17, 'Msg00000017', 'read', 'a:2:{i:0;s:12:\"User00000002\";i:1;s:12:\"User00000001\";}', 0, NULL),
(18, 'Msg00000018', 'read', 'a:2:{i:0;s:12:\"User00000002\";i:1;s:12:\"User00000001\";}', 0, NULL),
(19, 'Msg00000019', 'read', 'a:2:{i:0;s:12:\"User00000001\";i:1;s:12:\"User00000002\";}', 0, NULL),
(21, 'Msg00000021', 'read', 'a:2:{i:0;s:12:\"User00000001\";i:1;s:12:\"User00000002\";}', 1, 'a:1:{i:0;s:12:\"User00000001\";}'),
(22, 'Msg00000022', 'read', 'a:2:{i:0;s:12:\"User00000001\";i:1;s:12:\"User00000002\";}', 0, NULL),
(23, 'Msg00000023', 'read', 'a:2:{i:0;s:12:\"User00000001\";i:1;s:12:\"User00000002\";}', 0, NULL),
(24, 'Msg00000024', 'read', 'a:2:{i:0;s:12:\"User00000001\";i:1;s:12:\"User00000002\";}', 1, 'a:1:{i:0;s:12:\"User00000001\";}'),
(25, 'Msg00000025', 'read', 'a:2:{i:0;s:12:\"User00000001\";i:1;s:12:\"User00000003\";}', 1, 'a:1:{i:0;s:12:\"User00000001\";}'),
(26, 'Msg00000026', 'read', 'a:2:{i:0;s:12:\"User00000001\";i:1;s:12:\"User00000003\";}', 1, 'a:1:{i:0;s:12:\"User00000001\";}'),
(27, 'Msg00000027', 'read', 'a:2:{i:0;s:12:\"User00000001\";i:1;s:12:\"User00000003\";}', 1, 'a:1:{i:0;s:12:\"User00000001\";}'),
(28, 'Msg00000028', 'read', 'a:2:{i:0;s:12:\"User00000001\";i:1;s:12:\"User00000003\";}', 1, 'a:1:{i:0;s:12:\"User00000001\";}'),
(29, 'Msg00000029', 'read', 'a:2:{i:0;s:12:\"User00000001\";i:1;s:12:\"User00000003\";}', 1, 'a:1:{i:0;s:12:\"User00000001\";}'),
(30, 'Msg00000030', 'read', 'a:2:{i:0;s:12:\"User00000001\";i:1;s:12:\"User00000003\";}', 0, NULL),
(31, 'Msg00000031', 'read', 'a:2:{i:0;s:12:\"User00000001\";i:1;s:12:\"User00000003\";}', 0, NULL),
(32, 'Msg00000032', 'read', 'a:2:{i:0;s:12:\"User00000001\";i:1;s:12:\"User00000003\";}', 1, 'a:1:{i:0;s:12:\"User00000001\";}'),
(33, 'Msg00000033', 'read', 'a:2:{i:0;s:12:\"User00000002\";i:1;s:12:\"User00000001\";}', 1, 'a:2:{i:0;s:12:\"User00000001\";i:1;s:12:\"User00000002\";}'),
(34, 'Msg00000034', 'read', 'a:2:{i:0;s:12:\"User00000002\";i:1;s:12:\"User00000001\";}', 1, 'a:1:{i:0;s:12:\"User00000001\";}'),
(35, 'Msg00000035', 'read', 'a:2:{i:0;s:12:\"User00000002\";i:1;s:12:\"User00000001\";}', 1, 'a:1:{i:0;s:12:\"User00000001\";}'),
(36, 'Msg00000036', 'read', 'a:2:{i:0;s:12:\"User00000002\";i:1;s:12:\"User00000001\";}', 1, 'a:1:{i:0;s:12:\"User00000001\";}'),
(40, 'Msg00000040', 'read', 'a:2:{i:0;s:12:\"User00000003\";i:1;s:12:\"User00000001\";}', 1, 'a:1:{i:0;s:12:\"User00000001\";}'),
(53, 'Msg00000053', 'read', 'a:1:{i:0;s:12:\"User00000002\";}', 0, NULL),
(54, 'Msg00000054', 'read', 'a:1:{i:0;s:12:\"User00000002\";}', 0, NULL),
(55, 'Msg00000055', 'read', NULL, 0, NULL),
(85, 'Msg00000056', 'read', NULL, 0, NULL),
(86, 'Msg00000057', 'read', NULL, 0, NULL),
(87, 'Msg00000058', 'read', NULL, 0, NULL),
(88, 'Msg00000059', 'read', NULL, 0, NULL),
(89, 'Msg00000060', 'read', NULL, 0, NULL),
(90, 'Msg00000061', 'read', 'a:1:{i:0;s:12:\"User00000002\";}', 0, NULL),
(91, 'Msg00000062', 'read', 'a:1:{i:0;s:12:\"User00000001\";}', 0, NULL),
(92, 'Msg00000063', 'read', 'a:1:{i:0;s:12:\"User00000002\";}', 0, NULL),
(93, 'Msg00000064', 'read', 'a:1:{i:0;s:12:\"User00000002\";}', 0, NULL),
(94, 'Msg00000065', 'read', 'a:1:{i:0;s:12:\"User00000002\";}', 0, NULL),
(95, 'Msg00000066', 'read', 'a:1:{i:0;s:12:\"User00000001\";}', 0, NULL),
(96, 'Msg00000067', 'read', 'a:1:{i:0;s:12:\"User00000001\";}', 0, NULL),
(97, 'Msg00000068', 'read', 'a:1:{i:0;s:12:\"User00000002\";}', 0, NULL),
(98, 'Msg00000069', 'read', 'a:1:{i:0;s:12:\"User00000002\";}', 0, NULL),
(99, 'Msg00000070', 'read', 'a:1:{i:0;s:12:\"User00000002\";}', 0, NULL),
(100, 'Msg00000071', 'read', 'a:1:{i:0;s:12:\"User00000002\";}', 0, NULL),
(101, 'Msg00000072', 'read', NULL, 0, NULL),
(102, 'Msg00000073', 'read', NULL, 0, NULL),
(103, 'Msg00000074', 'read', 'a:1:{i:0;s:12:\"User00000002\";}', 0, NULL),
(104, 'Msg00000075', 'send', 'a:1:{i:0;s:12:\"User00000002\";}', 0, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `notification`
--

CREATE TABLE `notification` (
  `id` int(11) NOT NULL,
  `notificationID` varchar(30) NOT NULL,
  `fromID` varchar(20) NOT NULL,
  `toID` varchar(20) NOT NULL,
  `action` varchar(20) DEFAULT 'newMessage'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `on_status`
--

CREATE TABLE `on_status` (
  `id` int(11) NOT NULL,
  `userID` varchar(20) NOT NULL,
  `last_on_time` bigint(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `on_status`
--

INSERT INTO `on_status` (`id`, `userID`, `last_on_time`) VALUES
(3, 'User00000001', 1718297664),
(6, 'User00000003', 1717934507),
(14, 'User00000002', 1718287193);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `messages`
--
ALTER TABLE `messages`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `status_msgID` (`msgID`);

--
-- Indexes for table `notification`
--
ALTER TABLE `notification`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `statusDB` (`notificationID`),
  ADD KEY `statusDBUnique1` (`fromID`),
  ADD KEY `statusDBUnique2` (`toID`);

--
-- Indexes for table `on_status`
--
ALTER TABLE `on_status`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `on_status_userID` (`userID`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `messages`
--
ALTER TABLE `messages`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=105;

--
-- AUTO_INCREMENT for table `notification`
--
ALTER TABLE `notification`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=147;

--
-- AUTO_INCREMENT for table `on_status`
--
ALTER TABLE `on_status`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7923;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `messages`
--
ALTER TABLE `messages`
  ADD CONSTRAINT `toMsgs` FOREIGN KEY (`msgID`) REFERENCES `botsapp`.`messages` (`msgID`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `notification`
--
ALTER TABLE `notification`
  ADD CONSTRAINT `statusDBUnique1` FOREIGN KEY (`fromID`) REFERENCES `botsapp`.`users_account` (`userID`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `statusDBUnique2` FOREIGN KEY (`toID`) REFERENCES `botsapp`.`users_account` (`userID`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `on_status`
--
ALTER TABLE `on_status`
  ADD CONSTRAINT `on_status_user_id` FOREIGN KEY (`userID`) REFERENCES `botsapp`.`users_account` (`userID`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
