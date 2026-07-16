import dns from 'dns';
dns.setDefaultResultOrder('ipv4first');

import dotenv from 'dotenv';
import { initServer } from './configs/app.js';

dotenv.config();

initServer();