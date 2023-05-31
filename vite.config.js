import { resolve } from 'path'
import { defineConfig } from 'vite'

const root = resolve(__dirname, 'src');
const outDir = resolve(__dirname, 'dist');

// https://vitejs.dev/config/
export default defineConfig({
    root,
    server: {
        port: 5000
    },
    build: {
        outDir,
        emptyOutDir: true,
        rollupOptions: {
            input: {
                main: resolve(root, 'index.html'),
                resources: resolve(root, 'resources', 'index.html'),
                findCourses: resolve(root, 'find-courses', 'index.html'),
                courseSequence: resolve(root, 'course-sequence', 'index.html'),
                profile: resolve(root, 'profile', 'index.html'),
                forgotPassword: resolve(root, 'pages', 'forgot-password.html'),
                resetPassword: resolve(root, 'pages', 'reset-password.html'),
            }
        }
    }
})