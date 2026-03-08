import { config } from 'dotenv';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as authSchema from './schemas/auth';
import * as petSchemas from './schemas/pet';
import * as memberSchema from './schemas/member';
import * as memberPlanSchema from './schemas/member-plans';
import * as informationSchema from './schemas/informations';
import * as scheduleSchema from './schemas/schedules';
import * as videoSchema from './schemas/videos';
import * as blogSchema from './schemas/blogs';
import * as newsletterSchema from './schemas/newsletters';
import * as photoLibrarySchema from './schemas/photo-library';
import * as sponsorSchema from './schemas/sponsors';
import * as emailSendSchema from './schemas/email-sends';
import * as categorySchema from './schemas/categories';

config({ path: '.env' });

const client = postgres(process.env.DATABASE_URL!, { prepare: false });
export const db = drizzle({
    client,
    schema: {
        ...authSchema,
        ...petSchemas,
        ...memberSchema,
        ...memberPlanSchema,
        ...informationSchema,
        ...scheduleSchema,
        ...videoSchema,
        ...blogSchema,
        ...newsletterSchema,
        ...photoLibrarySchema,
        ...sponsorSchema,
        ...emailSendSchema,
        ...categorySchema
    },
});