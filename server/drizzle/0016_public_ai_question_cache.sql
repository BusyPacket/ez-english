CREATE TABLE `ai_question_cache` (
	`id` text PRIMARY KEY NOT NULL,
	`cache_key` text NOT NULL,
	`stem_hash` text NOT NULL,
	`payload` text NOT NULL,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `ai_question_cache_key_stem_uk` ON `ai_question_cache` (`cache_key`,`stem_hash`);
--> statement-breakpoint
CREATE INDEX `ai_question_cache_key_created_idx` ON `ai_question_cache` (`cache_key`,`created_at`);
