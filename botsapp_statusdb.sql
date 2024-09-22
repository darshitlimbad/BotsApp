-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Sep 20, 2024 at 08:36 PM
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
-- Table structure for table `blocked`
--

CREATE TABLE `blocked` (
  `id` int(11) NOT NULL,
  `fromID` varchar(20) NOT NULL,
  `toID` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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

-- --------------------------------------------------------

--
-- Table structure for table `notification`
--

CREATE TABLE `notification` (
  `id` int(11) NOT NULL,
  `notificationID` varchar(30) NOT NULL,
  `fromID` varchar(20) NOT NULL,
  `toID` varchar(20) NOT NULL,
  `action` varchar(20) DEFAULT 'newMessage',
  `msg` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `notification`
--

INSERT INTO `notification` (`id`, `notificationID`, `fromID`, `toID`, `action`, `msg`) VALUES
(799, 'Noti00000002', 'Admin', 'User95304512', 'acceptedChatterReq', 'N;');

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
(3, 'Admin', 1726045333),
(9202, 'Admin00000001', 1720803204),
(9230, 'User00000005', 1720805226),
(10368, 'User00000007', 1721457477),
(10402, 'User00000006', 1726043786),
(10954, 'User95304512', 1721730851);

-- --------------------------------------------------------

--
-- Table structure for table `reports`
--

CREATE TABLE `reports` (
  `id` int(11) NOT NULL,
  `fromID` varchar(20) NOT NULL,
  `toID` varchar(20) NOT NULL,
  `reason` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `reports`
--

INSERT INTO `reports` (`id`, `fromID`, `toID`, `reason`) VALUES
(76, 'Admin', 'User00000006', 'zxxzx');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `blocked`
--
ALTER TABLE `blocked`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `blocked_ids` (`fromID`,`toID`),
  ADD KEY `blockTableBlockedUserConstraint` (`toID`);

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
-- Indexes for table `reports`
--
ALTER TABLE `reports`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `report_ids` (`fromID`,`toID`) USING BTREE,
  ADD KEY `report_toID_constraint` (`toID`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `blocked`
--
ALTER TABLE `blocked`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=36;

--
-- AUTO_INCREMENT for table `messages`
--
ALTER TABLE `messages`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `notification`
--
ALTER TABLE `notification`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=821;

--
-- AUTO_INCREMENT for table `on_status`
--
ALTER TABLE `on_status`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13151;

--
-- AUTO_INCREMENT for table `reports`
--
ALTER TABLE `reports`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=77;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `blocked`
--
ALTER TABLE `blocked`
  ADD CONSTRAINT `blockTableBlockedUserConstraint` FOREIGN KEY (`toID`) REFERENCES `botsapp`.`users_account` (`userID`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `blockTableUserConstraint` FOREIGN KEY (`fromID`) REFERENCES `botsapp`.`users_account` (`userID`) ON DELETE CASCADE ON UPDATE CASCADE;

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

--
-- Constraints for table `reports`
--
ALTER TABLE `reports`
  ADD CONSTRAINT `report_constraint` FOREIGN KEY (`fromID`) REFERENCES `botsapp`.`users_account` (`userID`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `report_toID_constraint` FOREIGN KEY (`toID`) REFERENCES `botsapp`.`users_account` (`userID`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
