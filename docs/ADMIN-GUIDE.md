# ZipParents Admin Guide

## Overview

This guide covers admin panel functionality, moderation tools, and platform management.

## Table of Contents

1. [Accessing the Admin Panel](#accessing-the-admin-panel)
2. [Dashboard](#dashboard)
3. [User Management](#user-management)
4. [Content Moderation](#content-moderation)
5. [Event Management](#event-management)
6. [Reports & Flags](#reports--flags)
7. [Moderation Logs](#moderation-logs)
8. [Analytics](#analytics)
9. [Best Practices](#best-practices)

## Accessing the Admin Panel

### Admin Roles

- **Super Admin**: Full access
- **Moderator**: Content moderation only
- **Support**: Read-only access

### Login

1. Navigate to `/admin`
2. Login with admin credentials
3. You'll be redirected to admin dashboard

### Required Permissions

Admins are identified by `role: 'admin'` in their user document.

## Dashboard

### Overview Metrics

The dashboard shows:

- **Total Users**: Active user count
- **Active Users**: Users active in last 30 days
- **Total Events**: Upcoming and past events
- **Total Posts**: All community posts
- **Pending Reports**: Unreviewed reports
- **Flagged Content**: Content needing review

### Recent Activity

- New user signups
- Recent posts
- New events
- Moderation actions

### Quick Actions

- View pending reports
- Review flagged content
- Manage user accounts
- View moderation logs

## User Management

### Viewing Users

**User List** (`/admin/users`)
- Search by email or name
- Filter by status, role, verification
- Sort by join date, activity

**User Details** (`/admin/users/[userId]`)
- Profile information
- Account status
- Activity history
- Connection count
- Content statistics

### User Actions

#### Suspend User

**When to use:**
- Multiple minor violations
- Inappropriate behavior
- Temporary timeout needed

**How:**
1. Go to user details
2. Click "Suspend User"
3. Select duration (7, 14, 30 days)
4. Add reason (required)
5. Confirm

**Effect:**
- User can't login
- Content remains visible
- Can appeal after suspension

#### Ban User

**When to use:**
- Severe violations
- Repeated offenses after suspension
- Illegal activity
- Harassment or threats

**How:**
1. Go to user details
2. Click "Ban User"
3. Add detailed reason
4. Confirm (requires re-confirmation)

**Effect:**
- Permanent account closure
- All content hidden
- Email blocked from signup
- No appeal process

#### Verify User

**When to use:**
- Manual verification requests
- Profile verification needed
- Age verification issues

**How:**
1. Review user documentation
2. Go to user details
3. Click "Verify User"
4. Confirm verification

#### Unsuspend/Unban

**How:**
1. Go to user details
2. Click "Unsuspend" or "Unban"
3. Add reason
4. Confirm

### Search and Filters

**Search:**
- By email
- By display name
- By user ID

**Filters:**
- Status: Active, Suspended, Banned
- Role: User, Admin
- Verification: Verified, Unverified
- Age Verified: Yes, No

## Content Moderation

### Content Types

- **Posts**: Community feed posts
- **Events**: Community events
- **Messages**: Direct messages (only if reported)
- **Comments**: Post comments
- **Profiles**: User profile content

### Review Queue

**Priority Levels:**
1. 🔴 High: Illegal content, threats, harassment
2. 🟡 Medium: Inappropriate content, spam
3. 🟢 Low: Minor guideline violations

### Moderation Actions

#### Remove Content

**When to use:**
- Violates community guidelines
- Contains inappropriate material
- Spam or scam content

**How:**
1. Review reported content
2. Click "Remove Content"
3. Select reason
4. Add notes
5. Confirm

**Effect:**
- Content hidden from all users
- Author notified
- Logged in moderation history

#### Warn User

**When to use:**
- First-time minor violation
- Borderline inappropriate content
- Educational opportunity

**How:**
1. Review content
2. Click "Warn User"
3. Select warning template or write custom
4. Send warning

**Effect:**
- User receives notification
- Warning logged
- No content removal
- 3 warnings = automatic suspension

#### Dismiss Report

**When to use:**
- False report
- Content doesn't violate guidelines
- Issue resolved

**How:**
1. Review report
2. Click "Dismiss"
3. Add reason
4. Confirm

### Content Guidelines

**Remove if content contains:**
- Hate speech or discrimination
- Nudity or sexual content
- Violence or threats
- Personal information (doxxing)
- Spam or scams
- Illegal activity
- Copyright violations

**Allow if content contains:**
- Parenting advice (even if you disagree)
- Personal opinions
- Mild complaints
- Promotional content from verified organizations
- Educational material

## Event Management

### Event Moderation

**Review Events** (`/admin/events`)
- View all upcoming events
- Filter by date, location, status
- Check for inappropriate events

### Event Actions

#### Cancel Event

**When to use:**
- Safety concerns
- Inappropriate event
- Scam or spam
- Violates guidelines

**How:**
1. Go to event details
2. Click "Cancel Event"
3. Add reason
4. Notify attendees (optional)
5. Confirm

#### Feature Event

**When to use:**
- High-quality community event
- Promotes platform values
- Good for new users

**How:**
1. Review event quality
2. Click "Feature Event"
3. Set duration (1-7 days)

## Reports & Flags

### Report Types

- **User Reports**: Inappropriate user behavior
- **Content Reports**: Posts, comments, events
- **Message Reports**: Private message violations
- **Profile Reports**: Inappropriate profile content

### Report Queue

**Access:** `/admin/reports`

**Views:**
- **Pending**: Unreviewed reports
- **Reviewing**: Currently being reviewed
- **Resolved**: Action taken
- **Dismissed**: No action needed

### Reviewing Reports

1. **Read Report**: Review reported content
2. **Check Context**: View user history
3. **Verify Violation**: Compare to guidelines
4. **Take Action**: Choose appropriate response
5. **Document**: Add detailed notes
6. **Notify**: Inform reporter and offender

### Report Workflow

```
New Report
    ↓
Assign to Moderator
    ↓
Review Content
    ↓
Decision:
├─ Remove Content + Warn/Suspend
├─ Warn Only
└─ Dismiss Report
    ↓
Log Action
    ↓
Notify Users
    ↓
Close Report
```

### Response Times

- **High Priority**: <2 hours
- **Medium Priority**: <24 hours
- **Low Priority**: <48 hours

## Moderation Logs

### What's Logged

Every moderation action is logged:
- Action type
- Admin who performed action
- Timestamp
- Target user/content
- Reason
- Additional notes

### Viewing Logs

**Access:** `/admin/logs`

**Filter by:**
- Action type
- Date range
- Admin user
- Target user

### Log Retention

- Logs kept for 2 years
- Exportable for audits
- Archived after retention period

## Analytics

### Platform Metrics

- Daily active users (DAU)
- Monthly active users (MAU)
- User growth rate
- Retention rate
- Engagement metrics

### Content Metrics

- Posts per day
- Events created
- Message volume
- Report volume

### Moderation Metrics

- Reports resolved
- Average response time
- Actions by type
- Suspended/banned users

## Best Practices

### Moderation Principles

1. **Be Fair**: Apply rules consistently
2. **Be Clear**: Explain decisions
3. **Be Quick**: Respond to reports promptly
4. **Be Documented**: Log everything
5. **Be Human**: Consider context

### Decision Making

**Before Taking Action:**
- Review community guidelines
- Check user history
- Consider context
- Verify the violation
- Choose proportionate response

**Escalation Path:**
1. Warning (first offense)
2. Content removal (repeated offense)
3. Suspension (pattern of violations)
4. Ban (severe or repeated violations)

### Communication

**User Notifications:**
- Be professional and clear
- Explain what was violated
- State consequences
- Provide appeal process (when applicable)
- Be respectful

**Example Warning:**
```
Hello [Username],

We've reviewed your recent post and found that it
violates our Community Guidelines regarding [reason].

Specifically: [explanation]

We've removed the content. Please review our
guidelines to avoid future issues.

If you believe this was in error, you can appeal
by contacting support@zipparents.com.

- ZipParents Moderation Team
```

### Difficult Situations

**Handling Appeals:**
1. Review original decision
2. Check for new information
3. Consult with team if needed
4. Respond within 3 business days
5. Explain final decision

**Coordinating Bans:**
- Document thoroughly
- Get second opinion
- Inform support team
- Prepare for potential pushback

**Legal Issues:**
- Immediately escalate
- Preserve all evidence
- Don't remove content yet
- Contact legal team

## Tools & Resources

### Admin Shortcuts

- `/admin` - Dashboard
- `/admin/users` - User management
- `/admin/reports` - Report queue
- `/admin/events` - Event moderation
- `/admin/logs` - Moderation logs

### Support Resources

- **Admin Slack**: #admin-team
- **Escalation Email**: admin-escalation@zipparents.com
- **Legal Contact**: legal@zipparents.com
- **On-Call**: [Emergency contact]

### Training Materials

- Community Guidelines
- Moderation Playbook
- Decision Tree
- Example Scenarios
- Monthly Training Sessions

## Emergency Procedures

### Immediate Threats

If you see content involving:
- Immediate danger
- Child safety
- Illegal activity

**Action:**
1. Remove content immediately
2. Document everything
3. Escalate to supervisor
4. Contact legal if needed
5. File incident report

### System Issues

**If admin panel is down:**
1. Check status page
2. Contact DevOps
3. Use backup procedures
4. Communicate with team

## FAQ

**Q: How long should I keep reports open?**
A: Resolve within 24-48 hours. Close once action is taken.

**Q: Can I undo a ban?**
A: Yes, but requires supervisor approval.

**Q: What if a user keeps creating new accounts?**
A: IP ban may be necessary. Escalate to technical team.

**Q: How do I handle disagreements with other mods?**
A: Discuss with team lead. Document both viewpoints.

**Q: What if I make a mistake?**
A: Own it, reverse the action, apologize to user, learn from it.

## Contacts

- **Admin Team Lead**: [Contact]
- **Technical Support**: admin-tech@zipparents.com
- **Legal**: legal@zipparents.com
- **On-Call**: [Phone]

---

**Remember: You're helping create a safe, welcoming community for parents. Your work matters!** 🛡️
