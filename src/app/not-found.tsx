'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { motion } from 'framer-motion';

export default function NotFound() {
  const router = useRouter();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(to bottom, #fff5f5, #ffffff)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        textAlign: 'center',
      }}
    >
      <div style={{ marginBottom: '2rem' }}>
        <Image
          src="https://media.giphy.com/media/12HZukMBlutpoQ/giphy.gif"
          alt="Boxing Cat"
          width={300}
          height={300}
          style={{
            borderRadius: '16px',
            boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)',
          }}
        />
      </div>

      <h1 style={{ fontSize: '48px', fontWeight: 'bold', color: '#d97706', marginBottom: '0.5rem' }}>
        404 - Page Not Found
      </h1>
      <p style={{ color: '#4b5563', fontSize: '18px', maxWidth: '400px', marginBottom: '2rem' }}>
        Looks like our cat tried to fight the error... and lost 🥊🐱
      </p>

      <button
        onClick={() => router.back()}
        style={{
          backgroundColor: '#e11d48',
          color: '#ffffff',
          fontWeight: '600',
          padding: '12px 32px',
          borderRadius: '9999px',
          border: 'none',
          cursor: 'pointer',
          fontSize: '16px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          transition: 'background-color 0.3s',
        }}
        onMouseOver={(e) =>
          ((e.target as HTMLButtonElement).style.backgroundColor = '#be123c')
        }
        onMouseOut={(e) =>
          ((e.target as HTMLButtonElement).style.backgroundColor = '#e11d48')
        }
      >
        🔙 Go Back
      </button>
    </motion.div>
  );
}
