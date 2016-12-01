import { Schema, arrayOf } from '../libs/normalizr.min';

const draftSchema = new Schema('draft', {
  idAttribute: draft => draft.id
});

const consultationSchema = new Schema('consultations', {
  idAttribute: co => co.id
});

const userSchema = new Schema('users', {
  idAttribute: user => user.id
});

const oractorSchema = new Schema('oractors', {
  idAttribute: oractor => oractor.id
});

const talkSchema = new Schema('talks', {
  idAttribute: talk => talk.id
});

const commentSchema = new Schema('comments', {
  idAttribute: comment => comment.id
});

const talkQuestionSchema = new Schema('talkQuestions', {
  idAttribute: question => question.id
});

const talkAnswerSchema = new Schema('talkAnswers', {
  idAttribute: answer => answer.id
});

const wxShareSchema = new Schema('wxshares', {
  idAttribute: wxshare => wxshare.url
});

const discoverySubjectSchema = new Schema('discovery', {
  idAttribute: discover => discover.id
});

const defaultIssuesSchema = new Schema('issue', {
  idAttribute: issue => issue.id
});

const bannerSchema = new Schema('banner', {
  idAttribute: banner => banner.id
});

const productSchema = new Schema('products', {
  idAttribute: product => product.id
});

const appointmentSchema = new Schema('appointments', {
  idAttribute: appointment => appointment.id
});

const posterSchema = new Schema('poster', {
  idAttribute: poster => poster.id
});

const activitySchema = new Schema('activities', {
  idAttribute: activity => activity.id
});

appointmentSchema.define({
  oractor: oractorSchema,
  product: productSchema,
  talk: talkSchema
});

talkSchema.define({
  oractor: oractorSchema,
  comments: arrayOf(commentSchema),
  product: productSchema,
  questions: arrayOf(talkQuestionSchema)
});

/*
talkQuestionSchema.define({
  answers: arrayOf(talkAnswerSchema)
});
 */

bannerSchema.define({
  collection: arrayOf(discoverySubjectSchema)
});

userSchema.define({
  collection: discoverySubjectSchema
});

discoverySubjectSchema.define({
  members: arrayOf(userSchema),
  created_by: userSchema,
  default_issues: arrayOf(defaultIssuesSchema)
});

consultationSchema.define({
  consultant: userSchema,
  questioner: userSchema,
  collection: discoverySubjectSchema
});

commentSchema.define({
  user: userSchema,
  parent: commentSchema
});

const Schemas = {
  USER: userSchema,
  USER_ARRAY: arrayOf(userSchema),
  CONSULTATION: consultationSchema,
  CONSULTATION_ARRAY: arrayOf(consultationSchema),
  WXSHAREINFO: wxShareSchema,
  DISCOVERY_SUBJECT: discoverySubjectSchema,
  DEFAULT_ISSUE: defaultIssuesSchema,
  ISSUE_ARRAY: arrayOf(defaultIssuesSchema),
  DISCOVERY_ARRAY: arrayOf(discoverySubjectSchema),
  BANNER: bannerSchema,
  BANNER_ARRAY: arrayOf(bannerSchema),
  TALK: talkSchema,
  TALK_ARRAY: arrayOf(talkSchema),
  TALK_QUESTION_ARRAY: arrayOf(talkQuestionSchema),
  TALK_QUESTION: talkQuestionSchema,
  TALK_ANSWER: talkAnswerSchema,
  COMMENT: commentSchema,
  COMMENT_ARRAY: arrayOf(commentSchema),
  PRODUCT: productSchema,
  APPOINTMENT: appointmentSchema,
  POSTER: posterSchema,
  POSTER_ARRAY: arrayOf(posterSchema),
  ACTIVITY: activitySchema,
  ACTIVITY_ARRAY: arrayOf(activitySchema),
  DRAFT: draftSchema
};

export default Schemas;

export const defaultEntities = {
  users: {},
  talks: {},
  consultations: {},
  talkQuestions: {},
  talkAnswers: {},
  products: {},
  appointments: {},
  poster: {},
  activities: {}
};
