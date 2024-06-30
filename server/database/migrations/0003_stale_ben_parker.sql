ALTER TABLE "clients" ADD CONSTRAINT "clients_phone_unique" UNIQUE("phone");--> statement-breakpoint
ALTER TABLE "clients" ADD CONSTRAINT "clients_email_unique" UNIQUE("email");--> statement-breakpoint
ALTER TABLE "owners" ADD CONSTRAINT "owners_phone_unique" UNIQUE("phone");--> statement-breakpoint
ALTER TABLE "owners" ADD CONSTRAINT "owners_email_unique" UNIQUE("email");