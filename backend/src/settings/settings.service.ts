import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { getSettings } from "../models/settingsModel.js";

@Injectable()
export class SettingsService {
  async getAppSettings() {
    try {
      const settings = await getSettings();
      return settings;
    } catch (error) {
      throw new InternalServerErrorException("Settings could not be loaded");
    }
  }
}
