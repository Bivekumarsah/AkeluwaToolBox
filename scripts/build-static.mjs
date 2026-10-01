// Repository-root entry point; the website also builds independently on Vercel.
import { buildStatic } from '../website/scripts/build-static.mjs';

await buildStatic(new URL('../dist/', import.meta.url));
