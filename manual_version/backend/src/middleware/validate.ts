import type { Request, Response, NextFunction } from "express";

export const validateMesure = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const { niveauEau, debit, capteurId } = req.body;

  if (niveauEau === undefined || niveauEau === null) {
    res.status(400).json({ error: "niveauEau is required" });
    return;
  }

  if (typeof niveauEau !== "number") {
    res.status(400).json({ error: "niveauEau must be a number" });
    return;
  }

  if (niveauEau < 0) {
    res.status(400).json({ error: "niveauEau cannot be negative" });
    return;
  }

  if (niveauEau > 20) {
    res
      .status(400)
      .json({ error: "niveauEau exceeds maximum allowed value of 20" });
    return;
  }

  if (!capteurId) {
    res.status(400).json({ error: "capteurId is required" });
    return;
  }

  next();
};
