  
DROP PROCEDURE IF EXISTS getStreams;

DELIMITER $$
CREATE PROCEDURE getStreams  
(   
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
END $$

  