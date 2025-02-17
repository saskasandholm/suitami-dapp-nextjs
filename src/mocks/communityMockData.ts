/**
 * Community Analytics Mock Data
 * Version: 0.13.8
 *
 * This module provides mock data for the community analytics dashboard.
 * Recent updates include performance optimizations and improved type safety.
 */

import type {
  CommunityMetrics,
  SentimentData,
  TrendingTopic,
  PlatformMetrics,
  ChatPlatformMetrics,
  TwitterMetrics,
} from '@/types/community';

// Helper function to generate random data within a range
const randomInRange = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

// Helper function to generate dates for the last n days
const generateDates = (days: number) => {
  const dates = [];
  const now = new Date();
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    dates.push(date.toISOString().split('T')[0]);
  }
  return dates;
};

// Seeded random number generator
function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Rename EventConfig to SentimentEventConfig
interface SentimentEventConfig {
  day: number; // Day on which the event occurs
  type: 'product' | 'community' | 'technical' | 'governance';
  magnitude: number; // Base magnitude of the event (0-1)
  duration: number; // How many days the event affects (default: 1)
  impact: {
    // How the event affects each sentiment type
    positive: number; // Multiplier for positive impact
    neutral: number; // Multiplier for neutral impact
    negative: number; // Multiplier for negative impact
  };
}

interface SentimentConfig {
  basePositive?: number; // Base percentage for positive sentiment (default: 60)
  baseNeutral?: number; // Base percentage for neutral sentiment (default: 25)
  baseNegative?: number; // Base percentage for negative sentiment (default: 15)
  volatility?: {
    // Granular control over volatility
    positive?: number; // Volatility for positive sentiment (default: 0.15)
    neutral?: number; // Volatility for neutral sentiment (default: 0.1)
    negative?: number; // Volatility for negative sentiment (default: 0.2)
  };
  trend?: 'up' | 'down' | 'stable' | 'volatile'; // Overall trend direction
  trendStrength?: number; // How strong the trend is (default: 0.05)
  trendStart?: number; // Day to start trend (default: 0)
  trendEnd?: number; // Day to end trend (default: total days)
  randomEvents?: {
    // Random event configuration
    probability?: number; // Probability of a random event (default: 0.1)
    magnitude?: number; // Base magnitude of random events (default: 0.2)
    types?: ('product' | 'community' | 'technical' | 'governance')[];
  };
  scheduledEvents?: SentimentEventConfig[]; // Specific scheduled events
  seed?: number; // Seed for random number generation
}

// Update EVENT_IMPACTS to use SentimentEventConfig['type']
const EVENT_IMPACTS: Record<
  SentimentEventConfig['type'],
  { positive: number; neutral: number; negative: number }
> = {
  product: { positive: 1.5, neutral: 0.8, negative: 0.7 }, // Product launches tend to boost positive sentiment
  community: { positive: 1.2, neutral: 1.1, negative: 0.8 }, // Community events have balanced impact
  technical: { positive: 0.9, neutral: 1.3, negative: 1.1 }, // Technical updates can increase neutral/negative
  governance: { positive: 1.1, neutral: 1.2, negative: 0.9 }, // Governance tends to increase neutral sentiment
};

// Update calculateEventImpact function to use SentimentEventConfig
function calculateEventImpact(
  event: SentimentEventConfig,
  daysSinceEvent: number,
  rand: () => number
): { positive: number; neutral: number; negative: number } {
  const baseImpact = EVENT_IMPACTS[event.type];
  const eventDecay = Math.max(0, 1 - daysSinceEvent / event.duration);
  const randomVariation = 0.9 + rand() * 0.2; // 10% random variation

  return {
    positive:
      1 +
      (event.magnitude * baseImpact.positive * eventDecay * randomVariation - 1) *
        event.impact.positive,
    neutral:
      1 +
      (event.magnitude * baseImpact.neutral * eventDecay * randomVariation - 1) *
        event.impact.neutral,
    negative:
      1 +
      (event.magnitude * baseImpact.negative * eventDecay * randomVariation - 1) *
        event.impact.negative,
  };
}

// Helper function to validate sentiment data
function validateSentimentData(data: SentimentData[]): boolean {
  try {
    for (const point of data) {
      // Check if all required properties exist
      if (
        !point.date ||
        typeof point.positive !== 'number' ||
        typeof point.neutral !== 'number' ||
        typeof point.negative !== 'number' ||
        typeof point.score !== 'number'
      ) {
        console.error('Invalid data point structure:', point);
        return false;
      }

      // Validate value ranges
      if (
        point.positive < 0 ||
        point.positive > 100 ||
        point.neutral < 0 ||
        point.neutral > 100 ||
        point.negative < 0 ||
        point.negative > 100 ||
        point.score < 0 ||
        point.score > 100
      ) {
        console.error('Values out of valid range (0-100):', point);
        return false;
      }

      // Validate that percentages sum to approximately 100 (allowing for small rounding errors)
      const sum = point.positive + point.neutral + point.negative;
      if (Math.abs(sum - 100) > 0.1) {
        console.error('Percentages do not sum to 100:', sum, point);
        return false;
      }
    }
    return true;
  } catch (error) {
    console.error('Error validating sentiment data:', error);
    return false;
  }
}

// Helper function to ensure percentages sum to 100
function normalizeSentimentPercentages(
  positive: number,
  neutral: number,
  negative: number
): [number, number, number] {
  const total = positive + neutral + negative;
  return [(positive / total) * 100, (neutral / total) * 100, (negative / total) * 100];
}

// Helper function to apply trend to sentiment values
function applyTrend(
  value: number,
  trend: SentimentConfig['trend'],
  strength: number,
  day: number,
  totalDays: number
): number {
  switch (trend) {
    case 'up':
      return value * (1 + strength * (day / totalDays));
    case 'down':
      return value * (1 - strength * (day / totalDays));
    case 'volatile':
      return value * (1 + strength * Math.sin((day * Math.PI) / (totalDays / 4)));
    default: // 'stable'
      return value;
  }
}

// Generate mock sentiment data for the last n days
export const generateMockSentimentData = (
  days: number = 7,
  config: SentimentConfig = {}
): SentimentData[] => {
  // Set default configuration values
  const {
    basePositive = 60,
    baseNeutral = 25,
    baseNegative = 15,
    volatility = {
      positive: 0.15,
      neutral: 0.1,
      negative: 0.2,
    },
    trend = 'stable',
    trendStrength = 0.05,
    trendStart = 0,
    trendEnd = days,
    randomEvents = {
      probability: 0.1,
      magnitude: 0.2,
      types: ['product', 'community', 'technical', 'governance'] as const,
    },
    scheduledEvents = [],
    seed = Math.floor(Math.random() * 1000000),
  } = config;

  // Validate base percentages sum to 100
  const [normalizedPositive, normalizedNeutral, normalizedNegative] = normalizeSentimentPercentages(
    basePositive,
    baseNeutral,
    baseNegative
  );

  const rand = mulberry32(seed);

  return generateDates(days).map((date, index) => {
    // Apply daily volatility with granular control
    const positiveVolatility = (rand() - 0.5) * 2 * (volatility.positive ?? 0.15);
    const neutralVolatility = (rand() - 0.5) * 2 * (volatility.neutral ?? 0.1);
    const negativeVolatility = (rand() - 0.5) * 2 * (volatility.negative ?? 0.2);

    // Check for random events
    const hasEvent = rand() < (randomEvents.probability ?? 0.1);
    const eventEffect = hasEvent ? (rand() - 0.5) * 2 * (randomEvents.magnitude ?? 0.2) : 0;

    // Calculate base values with trend
    let positive = applyTrend(normalizedPositive, trend, trendStrength, index, days);
    let neutral = applyTrend(normalizedNeutral, trend, trendStrength, index, days);
    let negative = applyTrend(normalizedNegative, trend, trendStrength, index, days);

    // Apply volatility and events
    positive *= 1 + positiveVolatility + eventEffect;
    neutral *= 1 + neutralVolatility / 2; // Neutral is less affected by volatility
    negative *= 1 + negativeVolatility - eventEffect;

    // Normalize to ensure percentages sum to 100
    [positive, neutral, negative] = normalizeSentimentPercentages(positive, neutral, negative);

    // Calculate sentiment score (weighted average favoring positive sentiment)
    const score = (positive * 1 + neutral * 0.5) / (positive + neutral + negative);

    return {
      date,
      positive: Math.round(positive * 10) / 10, // Round to 1 decimal place
      neutral: Math.round(neutral * 10) / 10,
      negative: Math.round(negative * 10) / 10,
      score: Math.round(score * 100),
    };
  });
};

// Topic category definitions with associated keywords
const TOPIC_CATEGORIES = {
  product: {
    name: 'Product',
    prefixes: ['Launch:', 'Update:', 'Beta:', 'Release:', 'Preview:'] as const,
    keywords: [
      'NFT',
      'Token',
      'Marketplace',
      'Wallet',
      'DApp',
      'Smart Contract',
      'Protocol',
    ] as const,
    suffixes: ['v2', 'Integration', 'Feature', 'Improvement', 'Optimization'] as const,
  },
  community: {
    name: 'Community',
    prefixes: ['Community:', 'Event:', 'AMA:', 'Town Hall:', 'Meet-up:'] as const,
    keywords: [
      'AMA',
      'Meetup',
      'Contest',
      'Rewards',
      'Giveaway',
      'Collaboration',
      'Partnership',
    ] as const,
    suffixes: ['Announcement', 'Results', 'Winners', 'Highlights', 'Recap'] as const,
  },
  technical: {
    name: 'Technical',
    prefixes: ['Tech:', 'Dev:', 'Update:', 'Fix:', 'Security:'] as const,
    keywords: [
      'API',
      'Backend',
      'Frontend',
      'Database',
      'Infrastructure',
      'Performance',
      'Security',
    ] as const,
    suffixes: ['Patch', 'Hotfix', 'Enhancement', 'Migration', 'Upgrade'] as const,
  },
  governance: {
    name: 'Governance',
    prefixes: ['Proposal:', 'Vote:', 'DAO:', 'Governance:', 'Community:'] as const,
    keywords: [
      'DAO',
      'Voting',
      'Proposal',
      'Governance',
      'Treasury',
      'Policy',
      'Framework',
    ] as const,
    suffixes: ['Discussion', 'Vote', 'Results', 'Implementation', 'Review'] as const,
  },
} as const;

type TopicCategory = keyof typeof TOPIC_CATEGORIES;

interface TopicConfig {
  category: TopicCategory;
  topic: string; // Generated topic name
  basePopularity: number; // Base number of mentions (0-1)
  volatility: number; // How much mentions can vary (0-1)
  duration: number; // How many days the topic remains active
  sentiment: {
    positive: number;
    neutral: number;
    negative: number;
  };
  relatedTopics: string[];
}

interface TrendingTopicsConfig {
  numberOfTopics?: number; // Number of topics to generate (default: 4)
  categories?: TopicCategory[]; // Categories to include (default: all)
  timeRange?: number; // Days of data to generate (default: 7)
  topicLifespan?: {
    // Control topic lifecycle
    min?: number; // Minimum days a topic stays trending (default: 2)
    max?: number; // Maximum days a topic stays trending (default: 7)
  };
  mentionRange?: {
    // Control mention count ranges
    min?: number; // Minimum mentions (default: 50)
    max?: number; // Maximum mentions (default: 500)
  };
  volatility?: number; // How much topics fluctuate (0-1, default: 0.2)
  eventCorrelation?: boolean; // Whether to correlate with sentiment events (default: true)
  seed?: number; // Seed for random number generation
}

// Helper function to generate a topic name
function generateTopicName(category: TopicCategory, rand: () => number): string {
  const categoryConfig = TOPIC_CATEGORIES[category];
  const prefix = categoryConfig.prefixes[Math.floor(rand() * categoryConfig.prefixes.length)];
  const keyword = categoryConfig.keywords[Math.floor(rand() * categoryConfig.keywords.length)];
  const suffix = categoryConfig.suffixes[Math.floor(rand() * categoryConfig.suffixes.length)];

  // 50% chance to include a suffix
  return rand() > 0.5 ? `${prefix} ${keyword} ${suffix}` : `${prefix} ${keyword}`;
}

// Helper function to generate related topics
function generateRelatedTopics(
  category: TopicCategory,
  mainTopic: string,
  count: number,
  rand: () => number
): string[] {
  const categoryConfig = TOPIC_CATEGORIES[category];
  const allKeywords = Array.from(categoryConfig.keywords);

  // Remove the main topic's keyword to avoid duplication
  const mainKeyword = mainTopic
    .split(' ')
    .find(word => allKeywords.includes(word as (typeof categoryConfig.keywords)[number]));
  if (mainKeyword) {
    const index = allKeywords.indexOf(mainKeyword as (typeof categoryConfig.keywords)[number]);
    if (index > -1) allKeywords.splice(index, 1);
  }

  // Generate related topics
  const related: string[] = [];
  for (let i = 0; i < count && allKeywords.length > 0; i++) {
    const index = Math.floor(rand() * allKeywords.length);
    related.push(allKeywords[index].toLowerCase());
    allKeywords.splice(index, 1);
  }

  return related;
}

// Helper function to validate trending topics data
function validateTrendingTopicsData(topics: TrendingTopic[]): boolean {
  try {
    for (const topic of topics) {
      // Check required properties
      if (
        !topic.topic ||
        typeof topic.mentions !== 'number' ||
        typeof topic.sentiment !== 'number' ||
        !topic.trend ||
        !Array.isArray(topic.relatedTopics)
      ) {
        console.error('Invalid topic structure:', topic);
        return false;
      }

      // Validate ranges
      if (topic.mentions < 0 || topic.sentiment < 0 || topic.sentiment > 100) {
        console.error('Values out of valid range:', topic);
        return false;
      }

      // Validate trend value
      if (!['up', 'down', 'stable'].includes(topic.trend)) {
        console.error('Invalid trend value:', topic.trend);
        return false;
      }
    }
    return true;
  } catch (error) {
    console.error('Error validating trending topics data:', error);
    return false;
  }
}

// Generate mock trending topics
export const generateMockTrendingTopics = (config: TrendingTopicsConfig = {}): TrendingTopic[] => {
  // Set default configuration values
  const {
    numberOfTopics = 4,
    categories = Object.keys(TOPIC_CATEGORIES) as TopicCategory[],
    timeRange = 7,
    topicLifespan = { min: 2, max: 7 },
    mentionRange = { min: 50, max: 500 },
    volatility = 0.2,
    eventCorrelation = true,
    seed = Math.floor(Math.random() * 1000000),
  } = config;

  // Ensure required ranges have default values
  const lifespan = {
    min: topicLifespan?.min ?? 2,
    max: topicLifespan?.max ?? 7,
  };

  const mentions = {
    min: mentionRange?.min ?? 50,
    max: mentionRange?.max ?? 500,
  };

  const rand = mulberry32(seed);

  // Generate topics with their configurations
  const topicConfigs: TopicConfig[] = Array.from({ length: numberOfTopics }, () => {
    const category = categories[Math.floor(rand() * categories.length)];
    const basePopularity = 0.3 + rand() * 0.7; // Base popularity between 0.3 and 1.0
    const duration = Math.floor(lifespan.min + rand() * (lifespan.max - lifespan.min));

    // Generate topic name and related topics
    const topicName = generateTopicName(category, rand);
    const relatedTopics = generateRelatedTopics(
      category,
      topicName,
      2 + Math.floor(rand() * 2), // 2-3 related topics
      rand
    );

    // Generate sentiment distribution based on category and randomness
    const baseSentiment = {
      positive: 0.6 + rand() * 0.2, // 60-80% positive
      neutral: 0.2 + rand() * 0.15, // 20-35% neutral
      negative: 0.05 + rand() * 0.15, // 5-20% negative
    };

    return {
      category,
      topic: topicName,
      basePopularity,
      volatility: 0.1 + rand() * volatility,
      duration,
      sentiment: baseSentiment,
      relatedTopics,
    };
  });

  // Convert topic configs to trending topics
  const topics: TrendingTopic[] = topicConfigs.map(config => {
    // Calculate mentions with randomness and volatility
    const baseMentions = mentions.min + (mentions.max - mentions.min) * config.basePopularity;
    const mentionCount = Math.round(baseMentions * (1 + (rand() - 0.5) * 2 * config.volatility));

    // Calculate sentiment score from distribution
    const sentimentScore = Math.round(
      (config.sentiment.positive * 100 + config.sentiment.neutral * 50) /
        (config.sentiment.positive + config.sentiment.neutral + config.sentiment.negative)
    );

    // Determine trend based on mentions and randomness
    const trendRandom = rand();
    const trend = trendRandom > 0.6 ? 'up' : trendRandom > 0.3 ? 'stable' : 'down';

    return {
      topic: config.topic,
      mentions: mentionCount,
      sentiment: sentimentScore,
      trend,
      relatedTopics: config.relatedTopics,
    };
  });

  // Validate generated data
  if (!validateTrendingTopicsData(topics)) {
    console.error('Generated invalid trending topics data');
    throw new Error('Failed to generate valid trending topics');
  }

  return topics;
};

// Validation functions
function validatePlatformMetrics(metrics: PlatformMetrics): boolean {
  console.log('Validating platform metrics...');

  try {
    // Check if all required platforms exist
    if (!metrics.telegram || !metrics.discord || !metrics.twitter) {
      console.error('Missing platform data:', {
        hasTelegram: !!metrics.telegram,
        hasDiscord: !!metrics.discord,
        hasTwitter: !!metrics.twitter,
      });
      return false;
    }

    // Validate Telegram metrics
    const telegram = metrics.telegram;
    if (
      !telegram.members ||
      !telegram.active ||
      !telegram.messages ||
      !telegram.engagement ||
      !telegram.growth ||
      !telegram.sentiment
    ) {
      console.error('Invalid Telegram metrics:', telegram);
      return false;
    }

    // Validate Discord metrics
    const discord = metrics.discord;
    if (
      !discord.members ||
      !discord.active ||
      !discord.messages ||
      !discord.engagement ||
      !discord.growth ||
      !discord.sentiment
    ) {
      console.error('Invalid Discord metrics:', discord);
      return false;
    }

    // Validate Twitter metrics
    const twitter = metrics.twitter;
    if (
      !twitter.followers ||
      !twitter.active ||
      !twitter.engagement ||
      !twitter.growth ||
      !twitter.sentiment
    ) {
      console.error('Invalid Twitter metrics:', twitter);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error validating platform metrics:', error);
    return false;
  }
}

// Generate mock member growth data
export const generateMockMemberGrowthData = (
  days: number = 30
): { date: string; total: number; active: number; new: number }[] => {
  const data = [];
  const baseTotal = 10000;
  const baseActive = 3000;
  const baseNew = 100;

  // Generate data for each day
  for (let i = 0; i < days; i++) {
    const date = new Date();
    date.setDate(date.getDate() - (days - i - 1));

    // Add some randomness and growth trend
    const growthFactor = 1 + (i / days) * 0.5; // Gradual growth over time
    const randomVariation = 0.9 + Math.random() * 0.2; // Random variation between 0.9 and 1.1

    data.push({
      date: date.toISOString().split('T')[0],
      total: Math.round(baseTotal * growthFactor * randomVariation),
      active: Math.round(baseActive * growthFactor * randomVariation),
      new: Math.round(baseNew * randomVariation),
    });
  }

  return data;
};

interface ActivityRange {
  min: number;
  max: number;
}

interface HourlyActivityRanges {
  messages: ActivityRange;
  reactions: ActivityRange;
  threads: ActivityRange;
}

interface PeakHours {
  weekday: number[]; // Array of peak hours (0-23)
  weekend: number[]; // Array of peak hours (0-23)
}

interface ActivityMultipliers {
  night: number; // 00:00-06:59
  morning: number; // 07:00-08:59
  peak: number; // Configurable peak hours
  evening: number; // 18:00-23:59
}

interface EventConfig {
  probability: number; // Probability of event occurring (0-1)
  magnitude: number; // Base magnitude of event impact (1-5)
  duration: number; // Duration in hours (1-4)
  types: ('ama' | 'launch' | 'announcement' | 'incident')[];
}

interface HourlyActivityConfig {
  timezone?: string; // e.g., 'America/New_York'
  activityRanges?: HourlyActivityRanges;
  peakHours?: PeakHours;
  activityMultipliers?: ActivityMultipliers;
  dayOfWeekVariations?: {
    weekday: number; // Base multiplier for weekdays
    weekend: number; // Base multiplier for weekends
  };
  eventSimulation?: EventConfig;
  seed?: number; // For reproducible random generation
}

// Helper function to validate hourly activity data
function validateHourlyActivityData(
  data: { hour: string; messages: number; reactions: number; threads: number }[]
): boolean {
  try {
    for (const point of data) {
      // Check required properties
      if (
        !point.hour ||
        typeof point.messages !== 'number' ||
        typeof point.reactions !== 'number' ||
        typeof point.threads !== 'number'
      ) {
        console.error('Invalid hourly activity data point structure:', point);
        return false;
      }

      // Validate hour format
      const hourMatch = point.hour.match(/^([0-1]?[0-9]|2[0-3]):00$/);
      if (!hourMatch) {
        console.error('Invalid hour format:', point.hour);
        return false;
      }

      // Validate value ranges
      if (point.messages < 0 || point.reactions < 0 || point.threads < 0) {
        console.error('Negative values not allowed:', point);
        return false;
      }

      // Validate logical relationships
      if (point.reactions > point.messages * 3) {
        console.error('Unusually high reaction count:', point);
        return false;
      }

      if (point.threads > point.messages) {
        console.error('More threads than messages:', point);
        return false;
      }
    }
    return true;
  } catch (error) {
    console.error('Error validating hourly activity data:', error);
    return false;
  }
}

// Add validation function for hourlyActivityConfig
export function validateHourlyActivityConfig(config: HourlyActivityConfig): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  // Validate activity ranges
  if (config.activityRanges) {
    const { messages, reactions, threads } = config.activityRanges;

    if (messages.min >= messages.max) {
      errors.push('Messages range: minimum must be less than maximum');
    }
    if (reactions.min >= reactions.max) {
      errors.push('Reactions range: minimum must be less than maximum');
    }
    if (threads.min >= threads.max) {
      errors.push('Threads range: minimum must be less than maximum');
    }

    // Validate logical relationships
    if (reactions.max > messages.max * 3) {
      errors.push('Reactions maximum should not exceed 3 times the messages maximum');
    }
    if (threads.max > messages.max) {
      errors.push('Threads maximum should not exceed messages maximum');
    }
  }

  // Validate peak hours
  if (config.peakHours) {
    const { weekday, weekend } = config.peakHours;

    const validateHours = (hours: number[], type: string) => {
      for (const hour of hours) {
        if (hour < 0 || hour > 23) {
          errors.push(`Invalid ${type} peak hour: ${hour}. Hours must be between 0 and 23`);
        }
      }
    };

    validateHours(weekday, 'weekday');
    validateHours(weekend, 'weekend');
  }

  // Validate activity multipliers
  if (config.activityMultipliers) {
    const { night, morning, peak, evening } = config.activityMultipliers;

    if (night < 0) errors.push('Night multiplier must be non-negative');
    if (morning < 0) errors.push('Morning multiplier must be non-negative');
    if (peak < 0) errors.push('Peak multiplier must be non-negative');
    if (evening < 0) errors.push('Evening multiplier must be non-negative');
  }

  // Validate day of week variations
  if (config.dayOfWeekVariations) {
    const { weekday, weekend } = config.dayOfWeekVariations;

    if (weekday < 0) errors.push('Weekday multiplier must be non-negative');
    if (weekend < 0) errors.push('Weekend multiplier must be non-negative');
  }

  // Validate event simulation
  if (config.eventSimulation) {
    const { probability, magnitude, duration, types } = config.eventSimulation;

    if (probability < 0 || probability > 1) {
      errors.push('Event probability must be between 0 and 1');
    }
    if (magnitude < 1 || magnitude > 5) {
      errors.push('Event magnitude must be between 1 and 5');
    }
    if (duration < 1 || duration > 4) {
      errors.push('Event duration must be between 1 and 4 hours');
    }
    if (!types.length) {
      errors.push('Event types array cannot be empty');
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

// Update generateMockHourlyActivity to use the validation
export const generateMockHourlyActivity = (
  config: HourlyActivityConfig = {}
): { hour: string; messages: number; reactions: number; threads: number }[] => {
  // Validate configuration
  const validation = validateHourlyActivityConfig(config);
  if (!validation.isValid) {
    console.error('Invalid hourly activity configuration:', validation.errors);
    throw new Error(`Invalid hourly activity configuration:\n${validation.errors.join('\n')}`);
  }

  // Default configuration
  const {
    timezone = 'UTC',
    activityRanges = {
      messages: { min: 50, max: 200 },
      reactions: { min: 20, max: 100 },
      threads: { min: 5, max: 30 },
    },
    peakHours = {
      weekday: [10, 11, 12, 13, 14, 15, 16],
      weekend: [14, 15, 16, 17, 18, 19],
    },
    activityMultipliers = {
      night: 0.3, // 00:00-06:59
      morning: 0.8, // 07:00-08:59
      peak: 2.5, // Peak hours
      evening: 1.5, // 18:00-23:59
    },
    dayOfWeekVariations = {
      weekday: 1.0,
      weekend: 0.7,
    },
    eventSimulation = {
      probability: 0.1,
      magnitude: 2.0,
      duration: 2,
      types: ['ama', 'launch', 'announcement', 'incident'],
    },
    seed = Math.floor(Math.random() * 1000000),
  } = config;

  const rand = mulberry32(seed);
  const data: { hour: string; messages: number; reactions: number; threads: number }[] = [];

  // Determine if it's a weekend (for demo, let's say it's a weekday)
  const isWeekend = false;
  const dayMultiplier = isWeekend ? dayOfWeekVariations.weekend : dayOfWeekVariations.weekday;

  // Simulate random events
  const events: { hour: number; type: string; multiplier: number; duration: number }[] = [];
  if (rand() < eventSimulation.probability) {
    const eventHour = Math.floor(rand() * 24);
    const eventType = eventSimulation.types[Math.floor(rand() * eventSimulation.types.length)];
    events.push({
      hour: eventHour,
      type: eventType,
      multiplier: 1 + rand() * eventSimulation.magnitude,
      duration: Math.max(1, Math.floor(rand() * eventSimulation.duration)),
    });
  }

  // Generate data for each hour
  for (let i = 0; i < 24; i++) {
    const hour = i.toString().padStart(2, '0');

    // Determine base activity multiplier based on time of day
    let timeMultiplier = activityMultipliers.night; // Default to night multiplier

    if (i >= 7 && i < 9) {
      timeMultiplier = activityMultipliers.morning;
    } else if (
      (isWeekend && peakHours.weekend.includes(i)) ||
      (!isWeekend && peakHours.weekday.includes(i))
    ) {
      timeMultiplier = activityMultipliers.peak;
    } else if (i >= 18 && i < 24) {
      timeMultiplier = activityMultipliers.evening;
    }

    // Apply day of week multiplier
    timeMultiplier *= dayMultiplier;

    // Apply event multipliers if applicable
    const activeEvents = events.filter(event => i >= event.hour && i < event.hour + event.duration);
    const eventMultiplier = activeEvents.reduce((mult, event) => mult * event.multiplier, 1);
    timeMultiplier *= eventMultiplier;

    // Generate activity data with correlation between metrics
    const baseMessages = randomInRange(activityRanges.messages.min, activityRanges.messages.max);
    const messages = Math.round(baseMessages * timeMultiplier);

    // Reactions are correlated with messages
    const reactionRatio = 0.3 + rand() * 0.4; // 30-70% of messages get reactions
    const reactions = Math.round(messages * reactionRatio);

    // Threads are also correlated with messages
    const threadRatio = 0.05 + rand() * 0.15; // 5-20% of messages start threads
    const threads = Math.round(messages * threadRatio);

    data.push({
      hour: `${hour}:00`,
      messages,
      reactions,
      threads,
    });
  }

  // Validate generated data
  if (!validateHourlyActivityData(data)) {
    console.error('Generated invalid hourly activity data');
    throw new Error('Failed to generate valid hourly activity data');
  }

  return data;
};

// Generate mock metrics for all platforms
export const generateMockAllPlatformMetrics = (): PlatformMetrics => {
  console.log('Generating mock metrics for all platforms...');

  const metrics: PlatformMetrics = {
    telegram: {
      members: randomInRange(5000, 10000),
      active: randomInRange(1000, 3000),
      messages: randomInRange(10000, 20000),
      engagement: randomInRange(70, 90),
      growth: `${randomInRange(5, 15)}%`,
      sentiment: {
        positive: randomInRange(65, 80),
        neutral: randomInRange(15, 25),
        negative: randomInRange(5, 10),
        score: randomInRange(80, 95),
        total: randomInRange(1000, 2000),
        trend: Math.random() > 0.6 ? 'up' : Math.random() > 0.3 ? 'stable' : 'down',
      },
      trendingTopics: [],
      peakHours: ['09:00', '14:00', '20:00'],
      topChannels: [
        { name: 'general', messages: randomInRange(5000, 10000) },
        { name: 'support', messages: randomInRange(2000, 5000) },
      ],
    },
    discord: {
      members: randomInRange(8000, 15000),
      active: randomInRange(2000, 5000),
      messages: randomInRange(15000, 30000),
      engagement: randomInRange(75, 95),
      growth: `${randomInRange(8, 20)}%`,
      sentiment: {
        positive: randomInRange(70, 85),
        neutral: randomInRange(10, 20),
        negative: randomInRange(5, 10),
        score: randomInRange(85, 98),
        total: randomInRange(2000, 3000),
        trend: Math.random() > 0.6 ? 'up' : Math.random() > 0.3 ? 'stable' : 'down',
      },
      trendingTopics: [],
      peakHours: ['10:00', '15:00', '21:00'],
      topChannels: [
        { name: 'general', messages: randomInRange(8000, 15000) },
        { name: 'development', messages: randomInRange(3000, 7000) },
      ],
    },
    twitter: {
      followers: randomInRange(20000, 50000),
      active: randomInRange(5000, 10000),
      engagement: randomInRange(60, 85),
      growth: `${randomInRange(3, 12)}%`,
      sentiment: {
        positive: randomInRange(60, 75),
        neutral: randomInRange(20, 30),
        negative: randomInRange(5, 15),
        score: randomInRange(75, 90),
        total: randomInRange(1500, 2500),
        trend: Math.random() > 0.6 ? 'up' : Math.random() > 0.3 ? 'stable' : 'down',
      },
      trendingTopics: [],
      tweets: randomInRange(500, 1000),
      impressions: `${randomInRange(50000, 100000)}`,
      topContent: [
        { type: 'tweet', engagement: randomInRange(1000, 2000) },
        { type: 'reply', engagement: randomInRange(500, 1000) },
      ],
    },
  };

  if (!validatePlatformMetrics(metrics)) {
    console.error('Generated invalid platform metrics:', metrics);
    throw new Error('Failed to generate valid platform metrics');
  }

  console.log('Successfully generated platform metrics');
  return metrics;
};

// Generate empty platform metrics
const generateEmptyPlatformMetrics = (
  platform: 'telegram' | 'discord' | 'twitter'
): ChatPlatformMetrics | TwitterMetrics => {
  console.log(`Generating empty metrics for ${platform}...`);

  const baseMetrics = {
    active: 0,
    engagement: 0,
    growth: '0%',
    sentiment: {
      positive: 0,
      neutral: 0,
      negative: 0,
      score: 0,
      total: 0,
      trend: 'stable' as const,
    },
    trendingTopics: [],
  };

  if (platform === 'twitter') {
    const twitterMetrics: TwitterMetrics = {
      ...baseMetrics,
      followers: 0,
      tweets: 0,
      impressions: '0',
      topContent: [],
    };
    return twitterMetrics;
  }

  const chatMetrics: ChatPlatformMetrics = {
    ...baseMetrics,
    members: 0,
    messages: 0,
    peakHours: [],
    topChannels: [],
  };
  return chatMetrics;
};

// Generate mock metrics for a specific platform
export const generateMockPlatformMetrics = (platform: string): PlatformMetrics => {
  console.log(`Generating mock metrics for platform: ${platform}`);

  try {
    const allPlatformMetrics = generateMockAllPlatformMetrics();
    const emptyTelegram = generateEmptyPlatformMetrics('telegram') as ChatPlatformMetrics;
    const emptyDiscord = generateEmptyPlatformMetrics('discord') as ChatPlatformMetrics;
    const emptyTwitter = generateEmptyPlatformMetrics('twitter') as TwitterMetrics;

    const metrics = {
      telegram: platform === 'telegram' ? allPlatformMetrics.telegram : emptyTelegram,
      discord: platform === 'discord' ? allPlatformMetrics.discord : emptyDiscord,
      twitter: platform === 'twitter' ? allPlatformMetrics.twitter : emptyTwitter,
    };

    if (!validatePlatformMetrics(metrics)) {
      console.error('Generated invalid platform-specific metrics:', metrics);
      throw new Error('Failed to generate valid platform-specific metrics');
    }

    console.log('Successfully generated platform-specific metrics');
    return metrics;
  } catch (error) {
    console.error('Error generating platform metrics:', error);
    throw error;
  }
};
