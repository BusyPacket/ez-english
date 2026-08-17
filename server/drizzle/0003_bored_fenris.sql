PRAGMA foreign_keys=OFF;--> statement-breakpoint
DROP TABLE `progress`;--> statement-breakpoint
CREATE TABLE `progress` (
	`user_id` text NOT NULL,
	`point_id` text NOT NULL,
	`status` text DEFAULT 'todo' NOT NULL,
	`updated_at` text NOT NULL,
	PRIMARY KEY(`user_id`, `point_id`)
);--> statement-breakpoint
PRAGMA foreign_keys=ON;