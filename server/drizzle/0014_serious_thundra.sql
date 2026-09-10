CREATE TABLE `wrong_questions` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`question_id` text NOT NULL,
	`last_wrong_answer` text NOT NULL,
	`wrong_count` integer DEFAULT 1 NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `wrong_questions_user_question_uk` ON `wrong_questions` (`user_id`,`question_id`);