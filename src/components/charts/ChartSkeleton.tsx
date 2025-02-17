import { Card, Flex, Title } from '@tremor/react';
import { motion } from 'framer-motion';

interface ChartSkeletonProps {
  title?: string;
  height?: string;
  className?: string;
}

export default function ChartSkeleton({
  title,
  height = 'h-[300px]',
  className = '',
}: ChartSkeletonProps) {
  return (
    <Card className={`${className}`}>
      {title && (
        <Title className="mb-4">
          <div className="h-6 w-1/3 bg-accent/10 rounded animate-pulse" />
        </Title>
      )}
      <div className={`w-full ${height} relative overflow-hidden`}>
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-accent/5 via-accent/10 to-accent/5"
          animate={{
            x: ['0%', '100%', '0%'],
          }}
          transition={{
            duration: 2,
            ease: 'linear',
            repeat: Infinity,
          }}
        />
        <Flex className="h-full items-end justify-between px-4">
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="w-4 bg-accent/10 rounded-t animate-pulse"
              style={{
                height: `${Math.random() * 60 + 20}%`,
                animationDelay: `${i * 0.1}s`,
              }}
            />
          ))}
        </Flex>
      </div>
    </Card>
  );
}
