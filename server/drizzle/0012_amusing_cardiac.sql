CREATE TABLE `user_daily_answers` (
	`user_id` text NOT NULL,
	`date` text NOT NULL,
	`count` integer DEFAULT 1 NOT NULL,
	PRIMARY KEY(`user_id`, `date`)
);
