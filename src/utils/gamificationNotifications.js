import { getGamificationCopy } from "../constants/gamificationVisuals";

const pickRandom = (items) => items[Math.floor(Math.random() * items.length)];

// Turn a score label (from SCORE_LABELS on the backend) into a phrase that reads
// naturally after "…and ". The raw labels are status nouns, so "you're <label>"
// only works for "On Track" — everything else needs its own wording.
const SCORE_LABEL_PHRASES = {
  "Elite Execution": "you're executing at an elite level",
  "Strong Momentum": "you've got strong momentum",
  "On Track": "you're on track",
  "Needs Activity": "you need more activity",
  "Pipeline Risk": "your pipeline is at risk",
};

const getScoreLabelPhrase = (label) =>
  SCORE_LABEL_PHRASES[label] || (label ? `you're ${label.toLowerCase()}` : "");

export const buildGamificationNotification = ({
  user,
  scorecard,
  dailyMissions,
  leaderboard,
  tier,
  selectedModule,
}) => {
  const firstName = user?.fullName?.split(" ")?.[0] || "there";
  const daily = scorecard?.daily || {};
  const streak = scorecard?.streak || {};
  const currentRank = leaderboard?.currentUserRank?.rank;
  const moduleCopy = getGamificationCopy(selectedModule);
  const closedCount = daily?.stats?.contractsCount ?? daily?.stats?.salesCount ?? 0;
  const nextMission = dailyMissions?.missions?.find((mission) => !mission.completed);
  const completedMissionCount =
    dailyMissions?.missions?.filter((mission) => mission.completed)?.length || 0;
  const nextMissionProgress =
    nextMission?.progressLabel ||
    `${nextMission?.currentValue ?? 0}/${nextMission?.targetValue ?? nextMission?.target ?? 0}`;

  const candidates = [
    {
      title: `Let's go, ${firstName}`,
      body: "A strong day starts with one meaningful action. Open your dashboard and build momentum.",
    },
    {
      title: "Progress check",
      body: `Your execution score is ${daily?.score ?? 0}${
        daily?.label ? ` and ${getScoreLabelPhrase(daily.label)}` : ""
      }. Keep the pressure on.`,
    },
    {
      title: "Today's momentum",
      body: `You've completed ${completedMissionCount} mission${
        completedMissionCount === 1 ? "" : "s"
      } so far today. Keep stacking wins.`,
    },
  ];

  if (nextMission) {
    candidates.push(
      {
        title: "Mission in sight",
        body: `${nextMission.title} is next up. You're currently at ${nextMissionProgress}.`,
      },
      {
        title: "Stay on track",
        body: `${nextMissionProgress} completed on "${nextMission.title}". One more push gets you closer.`,
      }
    );
  }

  if (streak?.current) {
    candidates.push(
      {
        title: `${streak.current}-day streak active`,
        body: `You're on a ${streak.current}-day run. Show up today and protect the streak.`,
      },
      {
        title: "Consistency is compounding",
        body: `Your current streak is ${streak.current}. Another strong day keeps the momentum alive.`,
      }
    );
  }

  if (currentRank) {
    candidates.push(
      {
        title: "Leaderboard update",
        body: `You're currently ranked #${currentRank}. A few more quality actions could move you higher.`,
      },
      {
        title: "Competitive edge",
        body: `Your current weekly position is #${currentRank}. Open the app and press your advantage.`,
      }
    );
  }

  if (tier?.nextTier) {
    candidates.push(
      {
        title: "Tier progress",
        body: `You're ${Math.round(tier.progressPercent ?? 0)}% of the way to ${tier.nextTier}. Today's activity can move you closer.`,
      },
      {
        title: `${tier.currentTier || "Current"} level active`,
        body: `Keep building toward ${tier.nextTier}. Your lifetime score is ${tier.lifetimeScore ?? 0}.`,
      }
    );
  }

  if (closedCount > 0) {
    candidates.push({
      title: `${moduleCopy.closedUnitTitle} momentum`,
      body: `You've already logged ${closedCount} ${
        closedCount === 1
          ? moduleCopy.closedUnitSingular
          : moduleCopy.closedUnitPlural
      }. Stay sharp and finish strong.`,
    });
  }

  return pickRandom(candidates);
};
