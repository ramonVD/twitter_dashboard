-- This is all private, just to see the internal structure of the db
-- to use it as a reference and reflect changes.
-- `ramonVD$usertweets`.authors definition

CREATE TABLE `authors` (
  `author_id` int(10) unsigned NOT NULL,
  `name` varchar(100) NOT NULL,
  `username` varchar(100) NOT NULL,
  `location` varchar(100) NOT NULL,
  `profile_image_url` varchar(100) DEFAULT NULL,
  `url` varchar(100) DEFAULT NULL,
  `description` varchar(300) DEFAULT NULL,
  `verified` tinyint(1) DEFAULT NULL,
  `protected` tinyint(1) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  PRIMARY KEY (`author_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='Tweet authors';


-- `ramonVD$usertweets`.tweets definition

CREATE TABLE `tweets` (
  `tweet_id` int(10) unsigned NOT NULL,
  `author_id` int(10) unsigned NOT NULL,
  `conversation_id` varchar(100) NOT NULL,
  `text` varchar(300) DEFAULT NULL,
  `source` varchar(100) DEFAULT NULL,
  `lang` varchar(10) NOT NULL,
  `reply_settings` varchar(50) DEFAULT NULL,
  `retweets` int(10) unsigned NOT NULL,
  `likes` int(10) unsigned NOT NULL,
  `replies` int(10) unsigned NOT NULL,
  `quotes` int(10) unsigned NOT NULL,
  `possibly_sensitive` tinyint(1) DEFAULT NULL,
  `entities` json DEFAULT NULL,
  PRIMARY KEY (`tweet_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='The actual tweets';


-- `ramonVD$usertweets`.users definition

CREATE TABLE `users` (
  `user_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `hashed_pass` varchar(150) NOT NULL,
  `salt` varchar(100) NOT NULL,
  `mail` varchar(150) NOT NULL,
  `created_at` datetime NOT NULL,
  `last_login` datetime NOT NULL,
  PRIMARY KEY (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


-- `ramonVD$usertweets`.seen_tweets definition

CREATE TABLE `seen_tweets` (
  `reference_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int(10) unsigned DEFAULT NULL,
  `author_id` int(10) unsigned DEFAULT NULL,
  `tweet_id` int(10) unsigned DEFAULT NULL,
  PRIMARY KEY (`reference_id`),
  KEY `seen_tweets_user_id_IDX` (`user_id`) USING BTREE,
  KEY `seen_tweets_author_id_IDX` (`author_id`) USING BTREE,
  KEY `seen_tweets_tweet_id_IDX` (`tweet_id`) USING BTREE,
  CONSTRAINT `seen_tweets_FK` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE,
  CONSTRAINT `seen_tweets_FK_1` FOREIGN KEY (`author_id`) REFERENCES `authors` (`author_id`) ON DELETE CASCADE,
  CONSTRAINT `seen_tweets_FK_2` FOREIGN KEY (`tweet_id`) REFERENCES `tweets` (`tweet_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- `ramonVD$usertweets`.tweets_from_author definition

CREATE TABLE `tweets_from_author` (
  `reference_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `author_id` int(10) unsigned NOT NULL,
  `tweet_id` int(10) unsigned NOT NULL,
  PRIMARY KEY (`reference_id`),
  KEY `tweets_from_author_author_id_IDX` (`author_id`) USING BTREE,
  KEY `tweets_from_author_tweet_id_IDX` (`tweet_id`) USING BTREE,
  CONSTRAINT `tweets_from_author_FK` FOREIGN KEY (`author_id`) REFERENCES `authors` (`author_id`) ON DELETE CASCADE,
  CONSTRAINT `tweets_from_author_FK_1` FOREIGN KEY (`tweet_id`) REFERENCES `tweets` (`tweet_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;