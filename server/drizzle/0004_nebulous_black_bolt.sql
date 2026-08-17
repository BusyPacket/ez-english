CREATE TABLE `profiles` (
	`user_id` text PRIMARY KEY NOT NULL,
	`ai_provider` text DEFAULT 'deepseek' NOT NULL,
	`api_key` text NOT NULL,
	`updated_at` text NOT NULL
);
