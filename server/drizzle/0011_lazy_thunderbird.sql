CREATE TABLE `question_answers` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`question_id` text NOT NULL,
	`type` text DEFAULT 'single' NOT NULL,
	`user_answer` text NOT NULL,
	`is_correct` integer DEFAULT 0 NOT NULL,
	`answered_at` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `question_answers_user_question_uk` ON `question_answers` (`user_id`,`question_id`);