/*
 Navicat Premium Data Transfer

 Source Server         : localhostMySQL
 Source Server Type    : MySQL
 Source Server Version : 50726
 Source Host           : localhost:3306
 Source Schema         : wx_db

 Target Server Type    : MySQL
 Target Server Version : 50726
 File Encoding         : 65001

 Date: 18/09/2019 18:21:31
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for sendlog
-- ----------------------------
DROP TABLE IF EXISTS `sendlog`;
CREATE TABLE `sendlog`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `userId` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `momentId` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `content` varchar(2000) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `addDate` bigint(15) NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = MyISAM AUTO_INCREMENT = 429599 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for user
-- ----------------------------
DROP TABLE IF EXISTS `user`;
CREATE TABLE `user`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `userId` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `name` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = MyISAM AUTO_INCREMENT = 147955 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for userrelation
-- ----------------------------
DROP TABLE IF EXISTS `userrelation`;
CREATE TABLE `userrelation`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `userId` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `watchId` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `relation` tinyint(1) NULL DEFAULT 0,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = MyISAM AUTO_INCREMENT = 866825 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Procedure structure for getStreams
-- ----------------------------
DROP PROCEDURE IF EXISTS `getStreams`;
delimiter ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `getStreams`(   
   p_userId VARCHAR(50),
   p_lastId VARCHAR(50)
)
BEGIN  
/********************************************************************************************************  
Name         :  getStreams  
Description  : 
                 
Revision History  
----------------------------------------------------------------------------------------------------------  
Date        Name                 Description  
----------------------------------------------------------------------------------------------------------  
09/17/2019  Shaw Fan          Stored procedure created  

Sample Execution:   
  
*********************************************************************************************************/  
  
	DECLARE p_minDate BIGINT;
	
  create temporary table if not exists temp_tb    
	(    
		userId	    VARCHAR(50) NULL,
		momentId    VARCHAR(50) NULL,
		content     VARCHAR(2000) NULL,
		addDate     BIGINT 
	);
  truncate TABLE temp_tb;  -- 使用前先清空临时表。
			 
	/* 用in会出现字符长度超出问题
	INSERT INTO temp_tb(	
	SELECT sl.userId,sl.momentId,sl.content,sl.addDate 
	FROM sendlog AS sl
    WHERE sl.userId = p_userId
    OR sl.userId in (SELECT ul.watchId FROM userrelation AS ul WHERE ul.relation=1 AND ul.userId=p_userId)
    order by sl.addDate desc);
		*/
		
	INSERT INTO temp_tb(SELECT sl.userId,sl.momentId,sl.content,sl.addDate 
	FROM sendlog AS sl
	JOIN userrelation AS ul ON ul.watchId=sl.userId
	WHERE ul.relation=1 AND ul.userId=p_userId);
INSERT INTO temp_tb(	
	SELECT sl.userId,sl.momentId,sl.content,sl.addDate 
	FROM sendlog AS sl
    WHERE sl.userId = p_userId);

		

	IF (p_lastId is NULL) THEN
		SELECT tt.momentId as momentId,tt.userId as momentUserId,tt.content as content,tt.addDate from  temp_tb AS tt ORDER BY tt.addDate DESC LIMIT 50; 
  ELSE	    
	  SET p_minDate=(SELECT tt.addDate FROM temp_tb AS tt WHERE tt.momentId= p_lastId LIMIT 1);
		IF (p_minDate =( select min(t2.addDate) FROM temp_tb AS t2 )) THEN
			SELECT tt.momentId as momentId,tt.userId as momentUserId,tt.content as content,tt.addDate from  temp_tb AS tt ORDER BY tt.addDate DESC LIMIT 50; 
		ELSEIF p_minDate is NULL THEN
			SELECT tt.momentId as momentId,tt.userId as momentUserId,tt.content as content,tt.addDate from temp_tb AS tt ORDER BY tt.addDate DESC LIMIT 50; 
		ELSE
			SELECT tt.momentId as momentId,tt.userId as momentUserId,tt.content as content,tt.addDate from temp_tb AS tt WHERE tt.addDate<p_minDate ORDER BY tt.addDate DESC LIMIT 50; 
		END IF;	
	END IF;
END
;;
delimiter ;

SET FOREIGN_KEY_CHECKS = 1;
