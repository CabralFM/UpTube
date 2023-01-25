-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Jan 13, 2023 at 02:35 PM
-- Server version: 10.4.21-MariaDB
-- PHP Version: 8.1.6

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `uptube`
--

-- --------------------------------------------------------

--
-- Table structure for table `achievement`
--

CREATE TABLE `achievement` (
  `id` int(11) NOT NULL,
  `max_level` int(11) NOT NULL,
  `title` varchar(100) NOT NULL,
  `description` varchar(600) DEFAULT NULL,
  `path` varchar(600) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `achievement`
--

INSERT INTO `achievement` (`id`, `max_level`, `title`, `description`, `path`) VALUES
(8, 3, 'Adoram-me!', 'Total de gostos nos vídeos.\r\nBronze: 5 likes.\r\nPrata: 20 likes.\r\nOuro: 100 likes.', NULL),
(9, 3, 'Influencer!', 'Total de visualizações nos vídeos.\r\nBronze: 50 views.\r\nPrata: 200 views.\r\nOuro: 1000 views.', NULL),
(10, 3, 'Rising star!', 'Numéro de seguidores.\r\nBronze: 1 seguidor.\r\nPrata: 5 seguidores.\r\nOuro: 20 seguidores.', NULL),
(11, 3, 'Socialite!', 'Comentários postados noutros vídeos.\r\nBronze: 10 comentários.\r\nPrata: 50 comentários.\r\nOuro: 200 comentários.', NULL),
(12, 1, 'Só a começar!', 'Faz post do teu primeiro vídeo.', NULL),
(13, 1, 'Seguidor', 'Segue um canal.', NULL),
(14, 3, 'Stalker', 'Número de canais seguidos.\r\nBronze: 5 canais.\r\nPrata: 10 canais.\r\nOuro: 20 canais.', NULL),
(15, 1, 'Anti-social', 'Deixa de seguir um canal.', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `comment`
--

CREATE TABLE `comment` (
  `id` int(11) NOT NULL,
  `comment` varchar(2000) NOT NULL,
  `date` timestamp(6) NOT NULL DEFAULT current_timestamp(6) ON UPDATE current_timestamp(6),
  `id_user` int(11) NOT NULL,
  `id_video` varchar(45) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `notification`
--

CREATE TABLE `notification` (
  `id` int(11) NOT NULL,
  `id_sender` int(11) DEFAULT NULL,
  `id_recipient` int(11) DEFAULT NULL,
  `seen` tinyint(4) NOT NULL DEFAULT 0,
  `type` int(11) NOT NULL,
  `id_comment` int(11) DEFAULT NULL,
  `id_video` varchar(45) DEFAULT NULL,
  `id_playlist` int(11) DEFAULT NULL,
  `id_achievement` int(11) DEFAULT NULL,
  `date` datetime NOT NULL DEFAULT current_timestamp(),
  `mail` tinyint(4) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `notification_type`
--

CREATE TABLE `notification_type` (
  `id` int(11) NOT NULL,
  `description` varchar(500) DEFAULT NULL,
  `email` tinyint(4) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `notification_type`
--

INSERT INTO `notification_type` (`id`, `description`, `email`) VALUES
(1, 'Like', 0),
(2, 'Dislike', 0),
(3, 'Comment', 1),
(4, 'Subscribed', 1),
(5, 'Video upload', 1),
(6, 'Video Publish', 1),
(7, 'Recover Password', 1),
(8, 'User Added to Playlist', 1),
(9, 'User Added Video to Playlist', 0),
(10, 'Register', 1),
(11, 'Achievement', 0);

-- --------------------------------------------------------

--
-- Table structure for table `playlist`
--

CREATE TABLE `playlist` (
  `id` int(11) NOT NULL,
  `title` varchar(150) DEFAULT NULL,
  `description` varchar(800) DEFAULT NULL,
  `type` enum('public','private','unlisted') DEFAULT NULL,
  `total_time` time DEFAULT NULL,
  `created` datetime NOT NULL DEFAULT current_timestamp(),
  `modified` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `playlist`
--

INSERT INTO `playlist` (`id`, `title`, `description`, `type`, `total_time`, `created`, `modified`) VALUES
(1, 'Playlist sobre pandas', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum maximus metus vel metus aliquam dignissim. Nunc pulvinar ex sit amet lacus hendrerit imperdiet a ac urna.', 'public', '05:23:03', '2022-12-12 17:22:20', '2022-12-17 21:12:00'),
(2, 'Playlist sobre aves', 'Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Aenean ut eros et lacus faucibus semper nec non ipsum. ', 'public', '04:20:01', '2022-12-12 17:22:20', '2022-12-17 21:12:00'),
(3, 'Playlist sobre animais marinhos', 'Phasellus et interdum tortor. Suspendisse vulputate porttitor nisl, non hendrerit odio malesuada at. Sed hendrerit enim ut ultrices feugiat. Sed in dolor tellus. Etiam dolor elit, tincidunt in egestas sit amet, pulvinar sed velit.', 'public', '02:18:01', '2022-12-12 17:23:53', '2022-12-17 21:12:33'),
(4, 'Playlist sobre animais do Gerês', 'Sed in dolor tellus. Etiam dolor elit, tincidunt in egestas sit amet, pulvinar sed velit.', 'public', '05:20:03', '2022-12-12 17:23:53', '2022-12-17 21:13:31');

-- --------------------------------------------------------

--
-- Table structure for table `playlist_has_video`
--

CREATE TABLE `playlist_has_video` (
  `id_playlist` int(11) NOT NULL,
  `id_video` varchar(45) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `playlist_has_video`
--

INSERT INTO `playlist_has_video` (`id_playlist`, `id_video`) VALUES
(1, '4rfvgt'),
(1, '67ytg7'),
(2, '3445re'),
(2, '5674rf'),
(3, '222we3'),
(3, '3445re'),
(3, '4ejko9'),
(3, '54rty6'),
(4, '34289j'),
(4, '456tre'),
(4, '7y6543');

-- --------------------------------------------------------

--
-- Table structure for table `reaction`
--

CREATE TABLE `reaction` (
  `id` int(11) NOT NULL,
  `id_user` int(11) NOT NULL,
  `id_video` varchar(45) NOT NULL,
  `type` enum('like','dislike') NOT NULL,
  `date` timestamp(6) NOT NULL DEFAULT current_timestamp(6)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `report`
--

CREATE TABLE `report` (
  `id` int(11) NOT NULL,
  `date` datetime NOT NULL DEFAULT current_timestamp(),
  `id_reporter` int(11) NOT NULL,
  `modified` datetime DEFAULT NULL ON UPDATE current_timestamp(),
  `solved` tinyint(4) NOT NULL DEFAULT 0,
  `category` int(11) NOT NULL,
  `id_admin` int(11) NOT NULL DEFAULT 108,
  `id_video` varchar(45) DEFAULT NULL,
  `id_user` int(11) DEFAULT NULL,
  `id_comment` int(11) DEFAULT NULL,
  `observation` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `report`
--

INSERT INTO `report` (`id`, `date`, `id_reporter`, `modified`, `solved`, `category`, `id_admin`, `id_video`, `id_user`, `id_comment`, `observation`) VALUES
(1, '2022-10-05 11:38:06', 3, NULL, 1, 6, 108, '1wq342', NULL, NULL, 'Não identifiquei nenhuma anomalia.'),
(4, '2022-10-05 11:38:06', 3, NULL, 1, 8, 108, '3ewsdf56', NULL, NULL, 'Não identifiquei nenhuma anomalia.'),
(5, '2022-10-05 11:38:06', 3, NULL, 0, 11, 108, '3was12', NULL, NULL, '');

-- --------------------------------------------------------

--
-- Table structure for table `report_category`
--

CREATE TABLE `report_category` (
  `id` int(11) NOT NULL,
  `category` varchar(500) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `report_category`
--

INSERT INTO `report_category` (`id`, `category`) VALUES
(1, 'Conteúdo sexual'),
(2, 'Violência'),
(3, 'Conteúdo odioso ou abusivo'),
(4, 'Assédio ou intimidação'),
(5, 'Actos nocivos ou perigosos'),
(6, 'Desinformação'),
(7, 'Abuso de menores'),
(8, 'Promove terrorismo'),
(9, 'Spam ou enganador'),
(10, 'Infringe os meus direitos'),
(11, 'Erro no conteúdo');

-- --------------------------------------------------------

--
-- Table structure for table `search`
--

CREATE TABLE `search` (
  `id` int(11) NOT NULL,
  `id_user` int(11) NOT NULL,
  `keyword` varchar(200) DEFAULT NULL,
  `date` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `subscription`
--

CREATE TABLE `subscription` (
  `id` int(11) NOT NULL,
  `subscriber` int(11) NOT NULL,
  `subscribed` int(11) NOT NULL,
  `date` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `subscription`
--

INSERT INTO `subscription` (`id`, `subscriber`, `subscribed`, `date`) VALUES
(1, 3, 1, '2023-01-13 09:56:45'),
(2, 5, 1, '2023-01-01 09:56:45'),
(104, 4, 1, '2023-01-03 09:56:45'),
(105, 6, 1, '2023-01-01 09:56:45'),
(106, 1, 3, '2023-01-13 09:56:45'),
(107, 1, 4, '2023-01-01 09:56:45'),
(108, 1, 5, '2023-01-03 09:56:45'),
(109, 1, 6, '2023-01-01 09:56:45');

-- --------------------------------------------------------

--
-- Table structure for table `subtitles`
--

CREATE TABLE `subtitles` (
  `id` int(11) NOT NULL,
  `id_video` varchar(45) NOT NULL,
  `path` varchar(200) DEFAULT NULL,
  `language` varchar(45) DEFAULT NULL,
  `created` datetime NOT NULL,
  `modified` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `tag`
--

CREATE TABLE `tag` (
  `id` int(11) NOT NULL,
  `tag` varchar(80) NOT NULL,
  `id_user` int(11) NOT NULL,
  `id_video` varchar(45) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `tag`
--

INSERT INTO `tag` (`id`, `tag`, `id_user`, `id_video`) VALUES
(1, 'natureza', 1, '12sdca'),
(2, 'animais', 1, '12sdca'),
(14, 'pandas', 1, '1wq342'),
(20, 'mamiferos', 1, '1wq342'),
(24, 'natureza', 1, '222we3'),
(25, 'wildanimals', 1, '222we3'),
(26, 'wildnature', 1, '222we3'),
(27, 'mar', 1, '222we3'),
(28, 'peixes', 1, '222we3'),
(29, 'wild', 1, '34289j'),
(30, 'wildnature', 1, '34289j'),
(31, 'intothewild', 1, '34289j'),
(32, 'nature', 1, '34289j'),
(33, 'galicia', 1, '34289j'),
(40, 'natureza', 1, '1wq342'),
(41, 'animais', 1, '1wq342'),
(42, 'wildanimals', 1, '1wq342'),
(43, 'wildnature', 1, '1wq342'),
(44, 'wild', 1, '1wq342'),
(45, 'intothewild', 1, '1wq342'),
(46, 'natureza', 1, '3ewsdf56'),
(47, 'animais', 1, '3ewsdf56'),
(48, 'wildanimals', 1, '3ewsdf56'),
(49, 'wildnature', 1, '3ewsdf56'),
(50, 'wild', 1, '3ewsdf56'),
(51, 'intothewild', 1, '3ewsdf56'),
(52, 'natureza', 1, '3was12'),
(53, 'animais', 1, '3was12'),
(54, 'wildanimals', 1, '3was12'),
(55, 'wildnature', 1, '3was12'),
(56, 'wild', 1, '3was12'),
(57, 'intothewild', 1, '3was12'),
(58, 'natureza', 1, '4ejko9'),
(59, 'animais', 1, '4ejko9'),
(60, 'wildanimals', 1, '4ejko9'),
(61, 'wildnature', 1, '4ejko9'),
(62, 'wild', 1, '4ejko9'),
(63, 'intothewild', 1, '4ejko9'),
(64, 'animais', 1, '4rfvgt'),
(65, 'wildanimals', 1, '4rfvgt'),
(66, 'wildnature', 1, '4rfvgt'),
(67, 'wild', 1, '4rfvgt'),
(68, 'intothewild', 1, '4rfvgt'),
(69, 'animais', 1, '7y6543'),
(70, 'wildanimals', 1, '7y6543'),
(71, 'wildnature', 1, '7y6543'),
(72, 'wild', 1, '7y6543'),
(73, 'intothewild', 1, '7y6543'),
(79, 'animais', 1, '54rty6'),
(80, 'wildanimals', 1, '54rty6'),
(81, 'wildnature', 1, '54rty6'),
(82, 'wild', 1, '54rty6'),
(83, 'intothewild', 1, '54rty6'),
(89, 'animais', 1, '222we3'),
(90, 'wildanimals', 1, '222we3'),
(91, 'wildnature', 1, '222we3'),
(92, 'wild', 1, '222we3'),
(93, 'intothewild', 1, '222we3'),
(94, 'animais', 1, '456tre'),
(95, 'wildanimals', 1, '456tre'),
(96, 'wildnature', 1, '456tre'),
(97, 'wild', 1, '456tre'),
(98, 'intothewild', 1, '456tre'),
(99, 'wildanimals', 1, '678uyi'),
(100, 'wildnature', 1, '678uyi'),
(101, 'wild', 1, '678uyi'),
(102, 'intothewild', 1, '678uyi'),
(103, 'wildanimals', 1, '3445re'),
(104, 'wildnature', 1, '3445re'),
(105, 'wild', 1, '3445re'),
(106, 'intothewild', 1, '3445re'),
(107, 'animais', 1, '5674rf'),
(108, 'wildanimals', 1, '5674rf'),
(109, 'wildnature', 1, '5674rf'),
(110, 'wild', 1, '5674rf'),
(111, 'intothewild', 1, '5674rf'),
(112, 'animais', 1, '34289j'),
(113, 'wildanimals', 1, '34289j'),
(114, 'wildnature', 1, '34289j'),
(115, 'wild', 1, '34289j'),
(116, 'intothewild', 1, '34289j'),
(117, 'natureza', 2, 'gh9ijh'),
(118, 'caminho', 2, 'gh9ijh'),
(119, 'hike', 2, 'gh9ijh'),
(120, 'gohike', 2, 'gh9ijh'),
(121, 'path', 2, 'gh9ijh'),
(122, 'wild', 2, 'gh9ijh'),
(123, 'intothewild', 2, 'gh9ijh'),
(124, 'path', 2, 'gh9ijh'),
(125, 'natureza', 2, 'gh12ts'),
(126, 'caminho', 2, 'gh12ts'),
(127, 'hike', 2, 'gh12ts'),
(128, 'gohike', 2, 'gh12ts'),
(129, 'path', 2, 'gh12ts'),
(130, 'wild', 2, 'gh12ts'),
(131, 'intothewild', 2, 'gh12ts'),
(132, 'path', 2, 'gh12ts'),
(133, 'natureza', 2, 'gh12ws'),
(134, 'caminho', 2, 'gh12ws'),
(135, 'hike', 2, 'gh12ws'),
(136, 'gohike', 2, 'gh12ws'),
(137, 'path', 2, 'gh12ws'),
(138, 'wild', 2, 'gh12ws'),
(139, 'intothewild', 2, 'gh12ws'),
(140, 'path', 2, 'gh12ws'),
(141, 'natureza', 2, 'gh96tg'),
(142, 'caminho', 2, 'gh96tg'),
(143, 'hike', 2, 'gh96tg'),
(144, 'gohike', 2, 'gh96tg'),
(145, 'path', 2, 'gh96tg'),
(146, 'wild', 2, 'gh96tg'),
(147, 'intothewild', 2, 'gh96tg'),
(148, 'path', 2, 'gh96tg'),
(149, 'natureza', 2, 'gh6543'),
(150, 'caminho', 2, 'gh6543'),
(151, 'hike', 2, 'gh6543'),
(152, 'gohike', 2, 'gh6543'),
(153, 'path', 2, 'gh6543'),
(154, 'wild', 2, 'gh6543'),
(155, 'intothewild', 2, 'gh6543'),
(156, 'path', 2, 'gh6543');

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `id` int(11) NOT NULL,
  `admin` tinyint(1) NOT NULL DEFAULT 0,
  `active` tinyint(4) NOT NULL,
  `email` varchar(100) DEFAULT NULL,
  `password` varchar(100) DEFAULT NULL,
  `token` varchar(30) DEFAULT NULL,
  `username` varchar(50) DEFAULT NULL,
  `name` varchar(75) DEFAULT NULL,
  `description` varchar(800) DEFAULT NULL,
  `avatar` varchar(800) DEFAULT NULL,
  `banner` varchar(2000) DEFAULT NULL,
  `registered` datetime DEFAULT NULL,
  `total_views` int(11) DEFAULT NULL,
  `total_playlists` int(11) DEFAULT NULL,
  `total_videos` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`id`, `admin`, `active`, `email`, `password`, `token`, `username`, `name`, `description`, `avatar`, `banner`, `registered`, `total_views`, `total_playlists`, `total_videos`) VALUES
(1, 0, 1, 'jrochafonso@gmail.com', '$2a$12$tJrJpxY.JnNBgy8ysShlMunI0BjNNOUe0pEgbRYY9kFuBLhbqQf.m', NULL, 'Wild Nature Channel', 'Wild Nature Channel', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas nisi arcu, facilisis vitae ipsum ac, facilisis lacinia dolor. In justo justo, maximus at mattis eu, porttitor at nunc. Curabitur bibendum ut orci at scelerisque. Donec rutrum ligula non lorem ullamcorper, ac accumsan metus aliquet. Quisque diam enim, tempor sit amet lacinia a, bibendum vitae nulla. Proin eu elit ornare, ullamcorper tortor a, tincidunt dui. Nunc molestie tortor eget tellus scelerisque, in porttitor arcu fermentum. Fusce auctor nulla quis ipsum venenatis, at finibus lectus iaculis. Ut facilisis quam vitae lectus mattis tempor. Proin eget nibh a diam varius porttitor. Nunc pretium ipsum ut lorem dictum cursus.', 'https://th-thumbnailer.cdn-si-edu.com/2g8nKquP8amViV2k9lnR3YIfesk=/1000x750/filters:no_upscale():focal(4381x2523:4382x2524)/https://tf-cmsv2-smithsonianmag-media.s3.amazonaws.com/filer_public/e0/58/e058c2c2-b1d9-491c-abf5-973844b211a0/gettyimages-171399380.jpg', 'https://greensavers.sapo.pt/wp-content/uploads/2020/07/panda1.jpg', '2022-12-17 19:42:35', 3456, 3, 16),
(2, 0, 1, 'gohike@gmail.com', '$2a$12$eLKwQTsAbomxEPUnj6LCYO9rdVa/9E5inoPhssT.lMjtGRSM1mufK', NULL, 'gohike', 'Go hike!', 'Praesent pellentesque euismod leo, a ultricies dui faucibus non. Donec dolor diam, eleifend ac ultrices ac, aliquet nec ante. Suspendisse venenatis turpis eu felis malesuada, ac aliquam lorem ultricies.', 'https://helios-i.mashable.com/imagery/articles/03ZH6EcVL9WqXmDqjuqAy0E/hero-image.fill.size_1248x702.v1654717975.jpg', 'https://www.popsci.com/uploads/2021/11/09/Prepare-For-Difficult-Hike.jpeg', '2022-12-17 20:58:22', 1234, 3, 16),
(3, 0, 1, 'canalglobo@mail.com', '$2a$12$EvCPUHjx/nBLyVxkDERw.O2/u.sdt2ZXsbM4ylGqRLpw1uR94OVv.', NULL, 'canalglobo', 'Canal Globo', 'Phasellus et interdum tortor. Suspendisse vulputate porttitor nisl, non hendrerit odio malesuada at. Sed hendrerit enim ut ultrices feugiat. Sed in dolor tellus. Etiam dolor elit, tincidunt in egestas sit amet, pulvinar sed velit. Vestibulum odio quam, gravida at tincidunt eget, convallis non risus. Pellentesque vitae fringilla velit. Morbi quis auctor erat. Aliquam quis erat a ex tincidunt mollis at ut enim. Pellentesque sodales lorem sit amet bibendum sodales. Vivamus lobortis consequat velit non efficitur. Fusce dignissim lobortis posuere.', 'https://www.ctvnews.ca/polopoly_fs/1.5036379.1595530668!/httpImage/image.jpg_gen/derivatives/landscape_1020/image.jpg', 'https://www.incimages.com/uploaded_files/image/1920x1080/getty_583734066_335273.jpg', '2022-12-17 20:58:22', 12355678, 3, 16),
(4, 0, 1, 'ratatouille@mail.com', '$2a$12$7AbAfHwE./NPZwT6TqvAIuXdBg9vDkqV9U9Ll70cdKUvqdnRSaGOS', NULL, 'ratatouille', 'Ratatouille', 'Nam convallis turpis ligula, non gravida sapien facilisis at. Aliquam semper elit ligula, eu mollis erat mollis sit amet. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Aenean suscipit, ante pellentesque laoreet feugiat, mi leo hendrerit neque, eu tempor eros turpis ultrices purus. ', 'https://aodisseia.b-cdn.net/wp-content/uploads/2022/08/ratatouille-filme-pixar-curiosidades-11-1200x600.jpg', 'https://cdn.deliway.com.br/blog/base/219/0a8/771/receita-massa-italiana-ravioli.jpg', '2022-12-17 21:01:41', 345, 2, 14),
(5, 0, 1, 'CatsandCats@mail.com', '$2a$12$KgB1B.OXndqe278heNiy1eOnkeqPJ3LiHTrqGWGYmIZDRZE5twei.', NULL, 'cats&cats', 'Cats&Cats', 'Nam convallis turpis ligula, non gravida sapien facilisis at.', 'https://icatcare.org/app/uploads/2018/07/Thinking-of-getting-a-cat.png', 'https://www.valleywestvets.com/sites/default/files/interesting-cat-facts.jpg', '2022-12-17 21:01:41', 234, 3, 15),
(6, 0, 1, 'turbo@mail.com', '$2a$12$uHuTzuj2hwvD7SOWFc37puaIiStuUDfqtlAXInY8b4yVVSMIFY6M6', NULL, 'turbo', 'Turbo', 'Aenean finibus quis nisl ac venenatis. Donec lobortis, libero nec ullamcorper cursus, elit augue convallis lectus, ultrices tempus dui tellus nec nibh. Ut a est purus. ', 'https://cdn.aquelamaquina.pt/images/2020-10/img_944x629$2020_10_16_19_06_33_192129.jpg', 'https://classicmoto.rs/cdn/thmbs/12/cd/12cd97560117284fea6e6ca72c01d3e3.jpg', '2022-12-17 21:03:59', 456, 3, 16),
(108, 1, 1, 'felicio@mail.com', '$2a$12$6H9d8OjTIhDNUiERde3HxOHRDSZrJK6SzlySSxVgmrqm8IoeqXPJm', NULL, 'Felício Admin', 'Felício Admin', 'Administrador do Uptube.', 'https://s4.static.brasilescola.uol.com.br/img/2019/09/panda.jpg', 'https://doity.com.br//media/doity/eventos/evento-29545-banner.png', '2023-01-01 10:12:26', 0, 0, 0);

-- --------------------------------------------------------

--
-- Table structure for table `user_has_achievement`
--

CREATE TABLE `user_has_achievement` (
  `id` int(11) NOT NULL,
  `id_user` int(11) NOT NULL,
  `id_achievement` int(11) NOT NULL,
  `level` int(11) NOT NULL,
  `visible` tinyint(4) NOT NULL,
  `date` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `user_has_achievement`
--

INSERT INTO `user_has_achievement` (`id`, `id_user`, `id_achievement`, `level`, `visible`, `date`) VALUES
(1, 1, 8, 3, 1, '2022-12-17 21:42:05'),
(4, 1, 9, 2, 1, '2022-12-17 21:42:05'),
(6, 1, 10, 2, 1, '2022-12-17 21:43:17'),
(7, 1, 12, 1, 1, '2022-12-17 21:43:17'),
(8, 1, 13, 1, 1, '2022-12-17 21:44:37'),
(9, 1, 14, 1, 1, '2022-12-17 21:44:37'),
(10, 1, 15, 1, 1, '2022-12-17 21:45:26'),
(11, 2, 8, 1, 1, '2022-12-20 13:17:53'),
(12, 2, 11, 1, 1, '2022-12-20 13:18:28'),
(13, 108, 8, 3, 1, '2022-12-15 10:17:19'),
(14, 108, 15, 1, 1, '2022-10-11 10:21:51'),
(15, 108, 9, 3, 1, '2023-01-09 10:21:51'),
(16, 108, 10, 3, 1, '2022-09-21 10:23:19'),
(17, 108, 13, 1, 1, '2022-07-12 10:24:23'),
(18, 108, 11, 3, 1, '2022-09-13 10:24:23'),
(19, 108, 14, 3, 1, '2023-01-02 10:26:08'),
(20, 108, 12, 1, 1, '2023-01-10 10:26:08');

-- --------------------------------------------------------

--
-- Table structure for table `user_has_notification`
--

CREATE TABLE `user_has_notification` (
  `id_user` int(11) NOT NULL,
  `id_notification_type` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `user_has_notification`
--

INSERT INTO `user_has_notification` (`id_user`, `id_notification_type`) VALUES
(1, 1),
(1, 2),
(1, 3),
(1, 4),
(1, 5),
(1, 6),
(1, 7),
(1, 8),
(1, 9),
(1, 10),
(1, 11);

-- --------------------------------------------------------

--
-- Table structure for table `user_has_playlist`
--

CREATE TABLE `user_has_playlist` (
  `id_user` int(11) NOT NULL,
  `id_playlist` int(11) NOT NULL,
  `owner` tinyint(4) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `user_has_playlist`
--

INSERT INTO `user_has_playlist` (`id_user`, `id_playlist`, `owner`) VALUES
(1, 1, 1),
(1, 2, 1),
(1, 3, 1),
(2, 4, 1);

-- --------------------------------------------------------

--
-- Table structure for table `video`
--

CREATE TABLE `video` (
  `id` varchar(45) NOT NULL,
  `available` tinyint(1) NOT NULL DEFAULT 1,
  `title` varchar(200) DEFAULT NULL,
  `description` varchar(550) DEFAULT NULL,
  `length` time DEFAULT NULL,
  `views` int(11) DEFAULT NULL,
  `path` varchar(2000) NOT NULL,
  `uploaded` datetime NOT NULL DEFAULT current_timestamp(),
  `modified` datetime DEFAULT NULL ON UPDATE current_timestamp(),
  `progress` int(11) DEFAULT NULL,
  `thumbnail` varchar(1000) DEFAULT NULL,
  `id_user` int(11) NOT NULL,
  `total_comments` int(11) DEFAULT NULL,
  `total_likes` int(11) DEFAULT NULL,
  `total_dislikes` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `video`
--

INSERT INTO `video` (`id`, `available`, `title`, `description`, `length`, `views`, `path`, `uploaded`, `modified`, `progress`, `thumbnail`, `id_user`, `total_comments`, `total_likes`, `total_dislikes`) VALUES
('12sdca', 1, 'Pandas vermelhos', 'Integer sodales aliquam accumsan. Sed ullamcorper ipsum sed ultrices laoreet. Integer vitae metus sit amet nisl efficitur fringilla.', '00:37:25', 57, '/Users/jra/local_dev/UPskill/upskill_M10/uptube-grupo-3/uptube/server/public/uploads/0cPilqkHBBw/0cPilqkHBBw12d600ad58f4332a65003e3216522f24.mp4', '2022-12-12 16:16:33', '2023-01-13 11:27:19', NULL, 'https://upload.wikimedia.org/wikipedia/commons/e/e6/Red_Panda_%2824986761703%29.jpg', 1, 0, 5, 0),
('1wq342', 1, 'Video sobre pandas', 'Vestibulum porta congue diam non ullamcorper. Mauris egestas mi dui, quis sagittis nibh venenatis in.', '01:02:40', 234, 'https://th-thumbnailer.cdn-si-edu.com/2g8nKquP8amViV2k9lnR3YIfesk=/1000x750/filters:no_upscale():focal(4381x2523:4382x2524)/https://tf-cmsv2-smithsonianmag-media.s3.amazonaws.com/filer_public/e0/58/e058c2c2-b1d9-491c-abf5-973844b211a0/gettyimages-171399380.jpg', '2022-12-17 20:34:36', '2023-01-13 11:27:37', NULL, 'https://th-thumbnailer.cdn-si-edu.com/2g8nKquP8amViV2k9lnR3YIfesk=/1000x750/filters:no_upscale():focal(4381x2523:4382x2524)/https://tf-cmsv2-smithsonianmag-media.s3.amazonaws.com/filer_public/e0/58/e058c2c2-b1d9-491c-abf5-973844b211a0/gettyimages-171399380.jpg', 1, 0, 5, 0),
('222we3', 1, 'Peixe Palhaço', 'Quisque ut imperdiet elit. Proin egestas a quam in ultrices.', '01:12:54', 456, 'https://static.escolakids.uol.com.br/2020/11/peixe-palhaco.jpg', '2022-12-17 20:34:36', '2023-01-13 11:22:50', NULL, 'https://static.escolakids.uol.com.br/2020/11/peixe-palhaco.jpg', 1, 0, 5, 0),
('34289j', 1, 'Mocho-galego', 'Aenean vehicula magna nec est mollis, vel commodo ligula tempus.', '00:30:00', 678, 'https://gazetadascaldas.pt/wp-content/uploads/2019/08/mocho.jpg', '2022-12-12 16:50:24', '2023-01-13 11:22:50', NULL, 'https://gazetadascaldas.pt/wp-content/uploads/2019/08/mocho.jpg', 1, 0, 5, 0),
('3445re', 1, 'Imperadores no frio da Antártida', 'Morbi eros sem, tincidunt porttitor mauris sit amet, tincidunt ultricies felis. Pellentesque ut diam porttitor tortor vestibulum elementum. Vestibulum ultricies sagittis magna ac aliquam.', '00:31:38', 123, 'https://static.globalnoticias.pt/dn/image.jpg?brand=DN&type=generate&guid=628ba5f6-a606-4740-82c4-bc7ca5036852&t=20190106121107', '2022-12-12 16:35:30', '2023-01-13 11:22:50', NULL, 'https://static.globalnoticias.pt/dn/image.jpg?brand=DN&type=generate&guid=628ba5f6-a606-4740-82c4-bc7ca5036852&t=20190106121107', 1, 0, 5, 0),
('3ewsdf56', 1, 'Girafas na praia', 'Praesent dictum, leo non laoreet semper, quam libero scelerisque lectus, eu sollicitudin velit ex vitae massa. Aliquam ac tristique diam.', '00:33:39', 678, 'https://st.focusedcollection.com/13735766/i/650/focused_176556138-stock-photo-giraffes-walking-sand-beach-water.jpg', '2022-12-12 16:28:35', '2023-01-13 11:22:50', NULL, 'https://st.focusedcollection.com/13735766/i/650/focused_176556138-stock-photo-giraffes-walking-sand-beach-water.jpg', 1, 0, 5, 0),
('3was12', 1, 'Tigres bebés', 'Curabitur ac lacinia turpis. Etiam sed dolor justo. Praesent nec pulvinar nibh, in accumsan felis. Suspendisse potenti.', '00:33:55', 321, 'https://www.somosmamas.com.ar/wp-content/uploads/2021/09/Cachorro-de-Tigre.jpg?ezimgfmt=ngcb14/notWebP', '2022-12-12 16:31:51', '2023-01-13 11:22:50', NULL, 'https://www.somosmamas.com.ar/wp-content/uploads/2021/09/Cachorro-de-Tigre.jpg?ezimgfmt=ngcb14/notWebP', 1, 0, 5, 0),
('456tre', 1, 'Nova espécie de cobra', 'Cras enim metus, hendrerit venenatis laoreet id, cursus fringilla eros. Fusce faucibus quam leo, a dictum orci porttitor vel. Donec sed gravida enim, ut vehicula tortor.', '01:30:12', 456, 'https://super.abril.com.br/wp-content/uploads/2021/11/Nova-especie-de-cobra-do-Himalaia-foi-descoberta-gracas-a-um-post-no-instagram.jpg?quality=90&strip=info&resize=850,567', '2022-12-12 16:28:35', '2023-01-13 11:22:50', NULL, 'https://super.abril.com.br/wp-content/uploads/2021/11/Nova-especie-de-cobra-do-Himalaia-foi-descoberta-gracas-a-um-post-no-instagram.jpg?quality=90&strip=info&resize=850,567', 1, 0, 5, 0),
('4ejko9', 1, 'Urso polar em vias de extinção', 'Nam imperdiet dolor ac sem scelerisque ultricies. Maecenas eget vehicula tortor, in eleifend diam.', '00:35:23', 678, 'https://upload.wikimedia.org/wikipedia/commons/6/66/Polar_Bear_-_Alaska_%28cropped%29.jpg', '2022-12-12 16:35:30', '2023-01-13 11:28:08', NULL, 'https://upload.wikimedia.org/wikipedia/commons/6/66/Polar_Bear_-_Alaska_%28cropped%29.jpg', 1, 0, 5, 0),
('4rfvgt', 1, 'Pandas vermelhas a brincar', 'Vestibulum faucibus commodo ultricies. Cras consequat interdum fermentum. Proin pellentesque diam non nisl tempus, eu interdum felis lobortis.', '00:38:24', 654, '/uploads/qPS932igOmt/qPS932igOmt12d600ad58f4332a65003e3216522f24', '2022-12-12 16:23:12', '2023-01-13 11:28:25', NULL, 'https://laughingsquid.com/wp-content/uploads/2014/03/Red-Pandas-In-the-Snow-640x426.jpg', 1, 0, 5, 0),
('54rty6', 1, 'Espécie de tubarão vegetariano', 'Integer elementum purus erat, quis commodo tortor ullamcorper eget...', '00:23:12', 43, 'https://cdn-images.rtp.pt/icm/noticias/images/43/43413854a0cd5fa0aed969c886f297cb?w=1200&q=90&rect=0,95,1500,822&auto=format', '2022-12-12 16:45:40', '2023-01-13 11:30:16', NULL, 'https://cdn-images.rtp.pt/icm/noticias/images/43/43413854a0cd5fa0aed969c886f297cb?w=1200&q=90&rect=0,95,1500,822&auto=format', 1, 0, 5, 0),
('5674rf', 1, 'Águia real', 'Phasellus et interdum tortor. Suspendisse vulputate porttitor nisl, non hendrerit odio malesuada at. Sed hendrerit enim ut ultrices feugiat. Sed in dolor tellus.', '00:37:25', 567, 'https://vilanovaonline.pt/wp-content/uploads/2021/03/aguia-real-1280px-Chrysaetos_La_Canada_20120114_1-by-Juan-LaCruz-e1615590687654-800x500_c.jpg', '2022-12-12 16:50:24', '2023-01-13 11:30:16', NULL, 'https://vilanovaonline.pt/wp-content/uploads/2021/03/aguia-real-1280px-Chrysaetos_La_Canada_20120114_1-by-Juan-LaCruz-e1615590687654-800x500_c.jpg', 1, 0, 5, 0),
('678uyi', 1, 'A história do gato doméstico', 'Sed tincidunt, purus vestibulum molestie mollis, nunc metus pulvinar velit, vitae ullamcorper enim enim et nulla. Interdum et malesuada fames ac ante ipsum primis in faucibus.', '00:39:25', 666, 'https://images2.minutemediacdn.com/image/upload/c_fill,w_2160,ar_16:9,f_auto,q_auto,g_auto/shape%2Fcover%2Fsport%2F87226-gettyimages-1247734973-fb624124040b7676d4da16f7b3666048.jpg', '2022-12-12 16:31:51', '2023-01-13 11:30:16', NULL, 'https://images2.minutemediacdn.com/image/upload/c_fill,w_2160,ar_16:9,f_auto,q_auto,g_auto/shape%2Fcover%2Fsport%2F87226-gettyimages-1247734973-fb624124040b7676d4da16f7b3666048.jpg', 1, 0, 5, 0),
('67ytg7', 1, 'Pandas: comer e dormir', 'Fusce faucibus quam leo, a dictum orci porttitor vel. Donec sed gravida enim, ut vehicula tortor.', '02:06:52', 54, 'https://www.cnnbrasil.com.br/wp-content/uploads/sites/12/2021/06/12141_2C16A556F6BEDDA8.jpg?w=876&h=484&crop=1', '2022-12-12 16:23:12', '2023-01-13 11:30:16', NULL, 'https://www.cnnbrasil.com.br/wp-content/uploads/sites/12/2021/06/12141_2C16A556F6BEDDA8.jpg?w=876&h=484&crop=1', 1, 0, 5, 0),
('7y6543', 1, 'Lobo no Gerês', 'Nulla facilisi. Praesent et orci nibh.', '03:38:12', 543, 'https://www.petz.com.br/blog/wp-content/uploads/2022/10/lobo-e-carnivoro-interna-2.jpg', '2022-12-12 16:40:40', '2023-01-13 11:30:16', NULL, 'https://www.petz.com.br/blog/wp-content/uploads/2022/10/lobo-e-carnivoro-interna-2.jpg', 1, 0, 5, 0),
('frmzditVY9m', 1, 'Mimi Fofinha', 'Mimimimimi', '00:00:58', NULL, '/uploads/frmzditVY9m/frmzditVY9m12d600ad58f4332a65003e3216522f24', '2023-01-06 22:18:08', '2023-01-13 11:30:16', 100, '/uploads/frmzditVY9m/tn_2.png', 1, 0, 5, 0),
('gh12ts', 1, 'Como chegar à ponte de Mizarela', 'Ut et porta lorem, nec pretium tortor. Suspendisse rhoncus nulla ac lectus sagittis, in lacinia ipsum accumsan. Duis sed massa nulla.', '23:27:46', 0, '/uploads/qPS932igOmt/qPS932igOmt12d600ad58f4332a65003e3216522f24', '2022-12-30 23:09:01', '2023-01-13 11:30:16', NULL, 'https://i0.wp.com/www.vortexmag.net/wp-content/uploads/2015/04/21697_794428583937710_1254862754677595844_n.jpg?fit=750%2C502&ssl=1', 2, 0, 5, 0),
('gh12ws', 1, 'Os melhores trilhos de Portugal!', 'Ut et porta lorem, nec pretium tortor. Suspendisse rhoncus nulla ac lectus sagittis, in lacinia ipsum accumsan. Duis sed massa nulla.', '23:27:46', 0, '/uploads/qPS932igOmt/qPS932igOmt12d600ad58f4332a65003e3216522f24', '2022-12-30 23:09:01', '2023-01-13 11:30:16', NULL, 'https://florestas.pt/wp-content/uploads/2019/08/francisco-t-santos-sbDhQDgbxIg-unsplash-scaled.jpg', 2, 0, 5, 0),
('gh6543', 1, 'Trilho das Sete Lagoas', 'Nulla facilisi. Praesent et orci nibh.', '03:38:12', 543, '/uploads/qPS932igOmt/qPS932igOmt12d600ad58f4332a65003e3216522f24', '2022-12-12 16:40:40', '2023-01-13 11:30:16', NULL, 'https://media.iatiseguros.com/wp-content/uploads/sites/6/2019/03/01065904/cascata-tahiti-geres.jpg', 2, 0, 5, 0),
('gh96tg', 1, '', 'estibulum convallis auctor elit, vel maximus turpis molestie elementum.', '01:02:46', 0, '/uploads/qPS932igOmt/qPS932igOmt12d600ad58f4332a65003e3216522f24', '2022-12-30 00:02:46', '2023-01-13 11:30:16', NULL, 'https://www.vagamundos.pt/wp-content/uploads/2022/07/1-6.jpg', 2, 3, 0, NULL),
('gh9ijh', 1, 'Talasnal na Serra da Lousã', 'estibulum convallis auctor elit, vel maximus turpis molestie elementum.', '01:02:46', 0, '/uploads/qPS932igOmt/qPS932igOmt12d600ad58f4332a65003e3216522f24', '2022-12-30 00:02:46', '2023-01-11 17:56:59', NULL, '/uploads/qPS932igOmt/tn_2.png', 2, 50, 3, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `video_history`
--

CREATE TABLE `video_history` (
  `id` int(11) NOT NULL,
  `id_user` int(11) NOT NULL,
  `id_video` varchar(45) NOT NULL,
  `time` time DEFAULT NULL,
  `startstamp` timestamp(6) NULL DEFAULT NULL,
  `stopstamp` timestamp(6) NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `video_history`
--

INSERT INTO `video_history` (`id`, `id_user`, `id_video`, `time`, `startstamp`, `stopstamp`) VALUES
(1, 1, 'gh9ijh', '00:45:00', '2022-12-05 23:15:00.000000', '2022-12-06 00:00:00.000000'),
(2, 1, 'gh12ts', '00:45:00', '2022-12-07 23:15:00.000000', '2022-12-08 00:00:00.000000'),
(3, 1, 'gh12ws', '00:45:00', '2022-12-09 23:15:00.000000', '2022-12-10 00:00:00.000000'),
(4, 1, 'gh96tg', '00:45:00', '2022-12-11 23:15:00.000000', '2022-12-12 00:00:00.000000'),
(5, 1, 'gh9ijh', '00:45:00', '2022-12-13 23:15:00.000000', '2022-12-14 00:00:00.000000'),
(6, 1, 'gh12ts', '00:45:00', '2022-12-15 23:15:00.000000', '2022-12-16 00:00:00.000000'),
(7, 1, 'gh12ws', '00:45:00', '2022-12-17 23:15:00.000000', '2022-12-18 00:00:00.000000'),
(8, 1, 'gh96tg', '00:45:00', '2022-12-19 23:15:00.000000', '2022-12-20 00:00:00.000000');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `achievement`
--
ALTER TABLE `achievement`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `comment`
--
ALTER TABLE `comment`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_comment_1` (`id_user`),
  ADD KEY `fk_comment_2` (`id_video`);

--
-- Indexes for table `notification`
--
ALTER TABLE `notification`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_notification_1` (`id_sender`),
  ADD KEY `fk_notification_2` (`id_recipient`),
  ADD KEY `fk_notification_3` (`type`),
  ADD KEY `fk_notification_4` (`id_video`),
  ADD KEY `fk_notication_5` (`id_playlist`),
  ADD KEY `fk_notification_6` (`id_comment`),
  ADD KEY `fk_notification_7` (`id_achievement`);

--
-- Indexes for table `notification_type`
--
ALTER TABLE `notification_type`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `playlist`
--
ALTER TABLE `playlist`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `playlist_has_video`
--
ALTER TABLE `playlist_has_video`
  ADD PRIMARY KEY (`id_playlist`,`id_video`),
  ADD KEY `fk_phv_1` (`id_video`);

--
-- Indexes for table `reaction`
--
ALTER TABLE `reaction`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_reaction_1` (`id_video`),
  ADD KEY `fk_reaction_2` (`id_user`);

--
-- Indexes for table `report`
--
ALTER TABLE `report`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_report_1` (`id_admin`),
  ADD KEY `fk_report_2` (`category`),
  ADD KEY `fk_report_3` (`id_video`),
  ADD KEY `fk_report_4` (`id_comment`),
  ADD KEY `fk_report_5` (`id_user`),
  ADD KEY `fk_report_6` (`id_reporter`);

--
-- Indexes for table `report_category`
--
ALTER TABLE `report_category`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `search`
--
ALTER TABLE `search`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_search` (`id_user`);

--
-- Indexes for table `subscription`
--
ALTER TABLE `subscription`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_subscription_1` (`subscribed`),
  ADD KEY `fk_subscription_2` (`subscriber`);

--
-- Indexes for table `subtitles`
--
ALTER TABLE `subtitles`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_subtitles` (`id_video`);

--
-- Indexes for table `tag`
--
ALTER TABLE `tag`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_tag_1` (`id_user`),
  ADD KEY `fk_tag_2` (`id_video`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `user_has_achievement`
--
ALTER TABLE `user_has_achievement`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_uha_2` (`id_achievement`),
  ADD KEY `fk_uha_1` (`id_user`);

--
-- Indexes for table `user_has_notification`
--
ALTER TABLE `user_has_notification`
  ADD PRIMARY KEY (`id_user`,`id_notification_type`),
  ADD KEY `fk_uhn_2` (`id_notification_type`);

--
-- Indexes for table `user_has_playlist`
--
ALTER TABLE `user_has_playlist`
  ADD PRIMARY KEY (`id_user`,`id_playlist`),
  ADD KEY `fk_uhp_2` (`id_playlist`);

--
-- Indexes for table `video`
--
ALTER TABLE `video`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_video` (`id_user`);

--
-- Indexes for table `video_history`
--
ALTER TABLE `video_history`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_video_history_2` (`id_user`),
  ADD KEY `fk_video_history_1` (`id_video`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `achievement`
--
ALTER TABLE `achievement`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `comment`
--
ALTER TABLE `comment`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=118;

--
-- AUTO_INCREMENT for table `notification`
--
ALTER TABLE `notification`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=79;

--
-- AUTO_INCREMENT for table `notification_type`
--
ALTER TABLE `notification_type`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `playlist`
--
ALTER TABLE `playlist`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `reaction`
--
ALTER TABLE `reaction`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=96;

--
-- AUTO_INCREMENT for table `report`
--
ALTER TABLE `report`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `report_category`
--
ALTER TABLE `report_category`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `search`
--
ALTER TABLE `search`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `subscription`
--
ALTER TABLE `subscription`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=110;

--
-- AUTO_INCREMENT for table `subtitles`
--
ALTER TABLE `subtitles`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `tag`
--
ALTER TABLE `tag`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=229;

--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=110;

--
-- AUTO_INCREMENT for table `user_has_achievement`
--
ALTER TABLE `user_has_achievement`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT for table `video_history`
--
ALTER TABLE `video_history`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `comment`
--
ALTER TABLE `comment`
  ADD CONSTRAINT `fk_comment_1` FOREIGN KEY (`id_user`) REFERENCES `user` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_comment_2` FOREIGN KEY (`id_video`) REFERENCES `video` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `notification`
--
ALTER TABLE `notification`
  ADD CONSTRAINT `fk_notication_5` FOREIGN KEY (`id_playlist`) REFERENCES `playlist` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_notification_1` FOREIGN KEY (`id_sender`) REFERENCES `user` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_notification_2` FOREIGN KEY (`id_recipient`) REFERENCES `user` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_notification_3` FOREIGN KEY (`type`) REFERENCES `notification_type` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_notification_4` FOREIGN KEY (`id_video`) REFERENCES `video` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_notification_6` FOREIGN KEY (`id_comment`) REFERENCES `comment` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_notification_7` FOREIGN KEY (`id_achievement`) REFERENCES `achievement` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `playlist_has_video`
--
ALTER TABLE `playlist_has_video`
  ADD CONSTRAINT `fk_phv_1` FOREIGN KEY (`id_video`) REFERENCES `video` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_phv_2` FOREIGN KEY (`id_playlist`) REFERENCES `playlist` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `reaction`
--
ALTER TABLE `reaction`
  ADD CONSTRAINT `fk_reaction_1` FOREIGN KEY (`id_video`) REFERENCES `video` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_reaction_2` FOREIGN KEY (`id_user`) REFERENCES `user` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `report`
--
ALTER TABLE `report`
  ADD CONSTRAINT `fk_report_2` FOREIGN KEY (`category`) REFERENCES `report_category` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_report_3` FOREIGN KEY (`id_video`) REFERENCES `video` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_report_4` FOREIGN KEY (`id_comment`) REFERENCES `comment` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_report_5` FOREIGN KEY (`id_user`) REFERENCES `user` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_report_6` FOREIGN KEY (`id_reporter`) REFERENCES `user` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `search`
--
ALTER TABLE `search`
  ADD CONSTRAINT `fk_search` FOREIGN KEY (`id_user`) REFERENCES `user` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `subscription`
--
ALTER TABLE `subscription`
  ADD CONSTRAINT `fk_subscription_1` FOREIGN KEY (`subscribed`) REFERENCES `user` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_subscription_2` FOREIGN KEY (`subscriber`) REFERENCES `user` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `subtitles`
--
ALTER TABLE `subtitles`
  ADD CONSTRAINT `fk_subtitles` FOREIGN KEY (`id_video`) REFERENCES `video` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `tag`
--
ALTER TABLE `tag`
  ADD CONSTRAINT `fk_tag_1` FOREIGN KEY (`id_user`) REFERENCES `user` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_tag_2` FOREIGN KEY (`id_video`) REFERENCES `video` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `user_has_achievement`
--
ALTER TABLE `user_has_achievement`
  ADD CONSTRAINT `fk_uha_1` FOREIGN KEY (`id_user`) REFERENCES `user` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_uha_2` FOREIGN KEY (`id_achievement`) REFERENCES `achievement` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `user_has_notification`
--
ALTER TABLE `user_has_notification`
  ADD CONSTRAINT `fk_uhn_1` FOREIGN KEY (`id_user`) REFERENCES `user` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_uhn_2` FOREIGN KEY (`id_notification_type`) REFERENCES `notification_type` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `user_has_playlist`
--
ALTER TABLE `user_has_playlist`
  ADD CONSTRAINT `fk_uhp_1` FOREIGN KEY (`id_user`) REFERENCES `user` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_uhp_2` FOREIGN KEY (`id_playlist`) REFERENCES `playlist` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `video`
--
ALTER TABLE `video`
  ADD CONSTRAINT `fk_video` FOREIGN KEY (`id_user`) REFERENCES `user` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `video_history`
--
ALTER TABLE `video_history`
  ADD CONSTRAINT `fk_video_history_1` FOREIGN KEY (`id_video`) REFERENCES `video` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_video_history_2` FOREIGN KEY (`id_user`) REFERENCES `user` (`id`) ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
