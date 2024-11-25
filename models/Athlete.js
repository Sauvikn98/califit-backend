const mongoose = require('mongoose');

const AthleteSchema = new mongoose.Schema({
  basicInformation: {
    fullName: { type: String, required: true },
    nickname: { type: String },
    dob: { type: Date, required: true },
    gender: { type: String, enum: ['Male', 'Female', 'Other'], required: true },
    nationality: { type: String, required: true },
  },
  contactInformation: {
    phoneNumber: { type: String, required: true },
    email: { type: String, required: true },
    emergencyContactName: { type: String, required: true },
    emergencyContactNumber: { type: String, required: true },
    relationshipWithEmergencyContact: { type: String, required: true },
  },
  eventCategory: {
    mainSportCategory: [{ type: String, enum: ['Statics', 'Freestyle', 'Endurance Beginner', 'Endurance advanced', 'Streetlifting'], required: true }],
  },
  previousExperience: {
    participatedBefore: { type: Boolean, required: true },
    yearsOfExperience: { type: String },
    notableAchievements: { type: String },
  },
  healthAndFitness: {
    medicalConditions: { type: String },
    currentFitnessLevel: { type: String },
    onMedication: { type: Boolean, required: true },
    healthInsurance: { type: Boolean, required: true },
  },
  jerseyAndFood: {
    jerseySize: { type: String, enum: ['XS', 'S', 'M', 'L', 'XL', 'XXL'], required: true },
  },
  agreements: {
    waiverAgreement: { type: Boolean, required: true },
    mediaRelease: { type: Boolean, required: true },
    codeOfConduct: { type: Boolean, required: true },
  },
  submissionDetails: {
    confirmed: { type: Boolean, required: true },
    submissionDate: { type: Date, required: true },
  },
});

module.exports = mongoose.model('Athlete', AthleteSchema);
