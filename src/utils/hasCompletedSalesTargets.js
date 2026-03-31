const hasValue = (value) =>
  value !== null && value !== undefined && String(value).trim() !== "";

export const hasCompletedSalesTargets = (entries) => {
  const recruitmentTargets = entries?.RecruitmentsTargets || {};
  const successFormula = entries?.SuccessFormula || {};

  return [
    recruitmentTargets.annualProductionGoal,
    recruitmentTargets.totalCurrentNumberOfActiveAgents,
    recruitmentTargets.avgProductionPerActiveAgent,
    recruitmentTargets.avgProductionPerNewAgent,
    recruitmentTargets.numberOfWeeks,
    successFormula.prospectingApproach,
    successFormula.appointmentsKept,
    successFormula.presentationsHeld,
    successFormula.contractsSigned,
  ].every(hasValue);
};
