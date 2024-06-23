-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jun 23, 2024 at 07:15 PM
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

--
-- Dumping data for table `messages`
--

INSERT INTO `messages` (`id`, `msgID`, `status`, `seenByIDs`, `hide`, `hide_by`) VALUES
(358, 'Msg00000019', 'send', 'a:1:{i:0;s:12:\"User00000001\";}', 0, NULL),
(359, 'Msg00000020', 'send', 'a:1:{i:0;s:12:\"User00000001\";}', 0, NULL),
(403, 'Msg00000021', 'read', NULL, 0, NULL),
(404, 'Msg00000022', 'read', NULL, 0, NULL),
(405, 'Msg00000023', 'read', NULL, 0, NULL),
(409, 'Msg00000025', 'read', NULL, 0, NULL),
(423, 'Msg00000030', 'send', 'a:1:{i:0;s:12:\"User00000002\";}', 0, NULL),
(424, 'Msg00000031', 'send', 'a:1:{i:0;s:12:\"User00000002\";}', 0, NULL),
(425, 'Msg00000032', 'send', 'a:1:{i:0;s:12:\"User00000002\";}', 0, NULL),
(427, 'Msg00000034', 'send', 'a:1:{i:0;s:12:\"User00000002\";}', 0, NULL),
(429, 'Msg00000036', 'send', 'a:1:{i:0;s:12:\"User00000002\";}', 0, NULL),
(430, 'Msg00000037', 'send', 'a:1:{i:0;s:12:\"User00000002\";}', 0, NULL),
(431, 'Msg00000038', 'send', 'a:1:{i:0;s:12:\"User00000002\";}', 0, NULL),
(440, 'Msg00000041', 'read', 'a:1:{i:0;s:12:\"User00000001\";}', 0, NULL),
(441, 'Msg00000042', 'read', 'a:1:{i:0;s:12:\"User00000001\";}', 0, NULL),
(442, 'Msg00000043', 'read', 'a:1:{i:0;s:12:\"User00000001\";}', 0, NULL),
(443, 'Msg00000044', 'read', 'a:1:{i:0;s:12:\"User00000001\";}', 0, NULL),
(444, 'Msg00000045', 'read', 'a:1:{i:0;s:12:\"User00000001\";}', 0, NULL),
(445, 'Msg00000046', 'read', 'a:1:{i:0;s:12:\"User00000001\";}', 0, NULL),
(446, 'Msg00000047', 'read', 'a:1:{i:0;s:12:\"User00000001\";}', 0, NULL),
(447, 'Msg00000048', 'read', 'a:1:{i:0;s:12:\"User00000002\";}', 0, NULL),
(448, 'Msg00000049', 'read', 'a:1:{i:0;s:12:\"User00000002\";}', 0, NULL),
(449, 'Msg00000050', 'read', 'a:1:{i:0;s:12:\"User00000002\";}', 0, NULL),
(450, 'Msg00000051', 'read', 'a:1:{i:0;s:12:\"User00000002\";}', 0, NULL),
(451, 'Msg00000052', 'send', NULL, 0, NULL),
(452, 'Msg00000053', 'send', NULL, 0, NULL),
(453, 'Msg00000054', 'send', 'a:1:{i:0;s:12:\"User00000002\";}', 0, NULL),
(454, 'Msg00000055', 'send', 'a:1:{i:0;s:12:\"User00000002\";}', 0, NULL),
(455, 'Msg00000056', 'send', 'a:1:{i:0;s:12:\"User00000002\";}', 0, NULL),
(456, 'Msg00000057', 'send', 'a:1:{i:0;s:12:\"User00000002\";}', 0, NULL),
(457, 'Msg00000058', 'send', 'a:1:{i:0;s:12:\"User00000002\";}', 0, NULL),
(458, 'Msg00000059', 'send', 'a:1:{i:0;s:12:\"User00000002\";}', 0, NULL),
(459, 'Msg00000060', 'send', 'a:1:{i:0;s:12:\"User00000002\";}', 0, NULL),
(460, 'Msg00000061', 'send', NULL, 0, NULL),
(461, 'Msg00000062', 'read', NULL, 0, NULL),
(462, 'Msg00000063', 'read', NULL, 0, NULL),
(463, 'Msg00000064', 'send', 'a:1:{i:0;s:12:\"User00000002\";}', 0, NULL),
(464, 'Msg00000065', 'send', 'a:1:{i:0;s:12:\"User00000002\";}', 0, NULL),
(465, 'Msg00000066', 'send', 'a:1:{i:0;s:12:\"User00000002\";}', 0, NULL),
(466, 'Msg00000067', 'send', 'a:1:{i:0;s:12:\"User00000002\";}', 0, NULL),
(467, 'Msg00000068', 'send', 'a:1:{i:0;s:12:\"User00000002\";}', 0, NULL),
(468, 'Msg00000069', 'send', 'a:1:{i:0;s:12:\"User00000002\";}', 0, NULL),
(469, 'Msg00000070', 'send', 'a:1:{i:0;s:12:\"User00000002\";}', 0, NULL),
(470, 'Msg00000071', 'send', 'a:1:{i:0;s:12:\"User00000002\";}', 0, NULL),
(471, 'Msg00000072', 'send', 'a:1:{i:0;s:12:\"User00000002\";}', 0, NULL),
(472, 'Msg00000073', 'send', NULL, 0, NULL),
(473, 'Msg00000074', 'send', NULL, 0, NULL),
(474, 'Msg00000075', 'send', 'a:1:{i:0;s:12:\"User00000002\";}', 0, NULL),
(475, 'Msg00000076', 'send', 'a:1:{i:0;s:12:\"User00000002\";}', 0, NULL),
(476, 'Msg00000077', 'send', 'a:1:{i:0;s:12:\"User00000002\";}', 0, NULL),
(477, 'Msg00000078', 'send', 'a:1:{i:0;s:12:\"User00000002\";}', 0, NULL),
(478, 'Msg00000079', 'send', 'a:1:{i:0;s:12:\"User00000002\";}', 0, NULL),
(479, 'Msg00000080', 'send', 'a:1:{i:0;s:12:\"User00000002\";}', 0, NULL),
(480, 'Msg00000081', 'send', 'a:1:{i:0;s:12:\"User00000002\";}', 0, NULL),
(481, 'Msg00000082', 'send', 'a:1:{i:0;s:12:\"User00000002\";}', 0, NULL),
(482, 'Msg00000083', 'send', NULL, 0, NULL),
(483, 'Msg00000084', 'read', NULL, 0, NULL),
(484, 'Msg00000085', 'send', NULL, 0, NULL),
(485, 'Msg00000086', 'send', NULL, 0, NULL),
(486, 'Msg00000087', 'send', NULL, 0, NULL),
(487, 'Msg00000088', 'send', NULL, 0, NULL),
(488, 'Msg00000089', 'send', NULL, 0, NULL),
(489, 'Msg00000090', 'send', NULL, 0, NULL),
(490, 'Msg00000091', 'send', NULL, 0, NULL);

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
(348, 'Noti00000003', 'User00000001', 'User00000003', 'addUserReq', ''),
(349, 'Noti00000004', 'User00000002', 'User00000003', 'addUserReq', ''),
(417, 'Noti00000005', 'User00000001', 'User00000002', 'groupMemberAdded', 'a:1:{s:5:\"gName\";s:4:\"dsds\";}'),
(419, 'Noti00000006', 'User00000001', 'User00000002', 'groupMemberAdded', 'a:1:{s:5:\"gName\";s:5:\"test1\";}'),
(421, 'Noti00000007', 'User00000001', 'User00000002', 'groupMemberAdded', 'a:1:{s:5:\"gName\";s:5:\"test1\";}'),
(423, 'Noti00000008', 'User00000001', 'User00000002', 'groupMemberAdded', 'a:1:{s:5:\"gName\";s:5:\"test2\";}'),
(425, 'Noti00000009', 'User00000001', 'User00000002', 'groupMemberAdded', 'a:1:{s:5:\"gName\";s:5:\"test3\";}'),
(428, 'Noti00000010', 'User00000001', 'User00000002', 'groupMemberAdded', 'a:1:{s:5:\"gName\";s:5:\"test3\";}'),
(430, 'Noti00000011', 'User00000001', 'User00000002', 'groupMemberAdded', 'a:1:{s:5:\"gName\";s:5:\"test4\";}'),
(432, 'Noti00000012', 'User00000001', 'User00000002', 'groupRemovedMember', 'a:1:{s:5:\"gName\";s:5:\"test4\";}'),
(433, 'Noti00000013', 'User00000001', 'User00000002', 'groupRemovedMember', 'a:1:{s:5:\"gName\";s:5:\"test3\";}'),
(434, 'Noti00000014', 'User00000001', 'User00000002', 'groupRemovedMember', 'a:1:{s:5:\"gName\";s:5:\"test3\";}'),
(435, 'Noti00000015', 'User00000001', 'User00000002', 'groupRemovedMember', 'a:1:{s:5:\"gName\";s:5:\"test2\";}'),
(436, 'Noti00000016', 'User00000001', 'User00000002', 'groupRemovedMember', 'a:1:{s:5:\"gName\";s:5:\"test1\";}'),
(437, 'Noti00000017', 'User00000001', 'User00000002', 'groupRemovedMember', 'a:1:{s:5:\"gName\";s:5:\"test1\";}'),
(439, 'Noti00000019', 'User00000001', 'User00000002', 'groupRemovedMember', 'a:1:{s:5:\"gName\";s:4:\"dsds\";}');

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
(3, 'User00000001', 1719162931),
(6, 'User00000003', 1717934507),
(14, 'User00000002', 1719162907),
(9037, 'User00000004', 1718991934);

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
(15, 'User00000001', 'User00000002', 'dsds');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `blocked`
--
ALTER TABLE `blocked`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `blocked_ids` (`fromID`,`toID`);

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
  ADD UNIQUE KEY `report_ids` (`fromID`,`toID`) USING BTREE;

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `blocked`
--
ALTER TABLE `blocked`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `messages`
--
ALTER TABLE `messages`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=492;

--
-- AUTO_INCREMENT for table `notification`
--
ALTER TABLE `notification`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=440;

--
-- AUTO_INCREMENT for table `on_status`
--
ALTER TABLE `on_status`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9054;

--
-- AUTO_INCREMENT for table `reports`
--
ALTER TABLE `reports`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

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

--
-- Constraints for table `reports`
--
ALTER TABLE `reports`
  ADD CONSTRAINT `report_constraint` FOREIGN KEY (`fromID`) REFERENCES `botsapp`.`users_account` (`userID`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
