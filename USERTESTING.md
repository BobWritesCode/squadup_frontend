# Squad Up User Testing

These are all the manual tests I did. I logged all errors and fixes, including issue numbers and commit numbers.

| **Test** | **Expected result** | **Outcome** | **Final Result** |
| ---- | ------ | ------ | ------ |
| **Homepage / NavBar / Quick Links** (Not logged in) |
| Load homepage | Homepage loads | AE | Pass |
|  | Navbar shows: Home, Sign In, Sign Up. | AE | Pass |
|  | Quick links shows: Sign In, Sign Up. | AE | Pass |
| | Footer shows | AE | Pass |
| Click Sign In (Navbar) | Sign In page loads | AE | Pass |
| Click Sign In (Quick link) | Sign In page loads | AE | Pass |
| Click Sign Up (Navbar) | Sign Up page loads | AE | Pass |
| Click Sign Up (Quick link) | Sign Up page loads | AE | Pass |
| **Homepage / NavBar / Quick Links** (Logged in) |
| Load homepage | Homepage loads | AE | Pass |
|  | Navbar shows: Home, Squad Finder, Profiles, Search bar, Sign Out. | AE | Pass |
|  | Quick links shows: Squad Finder, Profiles. | AE | Pass |
| | Footer shows | AE | Pass |
| Click Squad Finder (Navbar) | Squad Finder page loads | AE | Pass |
| Click Squad Finder (Quick link) | Squad Finder page loads | AE | Pass |
| Click Profiles (Navbar) | Profiles page loads | AE | Pass |
| Click Profiles (Quick link) | Profiles page loads | AE | Pass |
| Click Sign Out (Navbar) | Signs user out and takes to homepage | AE | Pass |
| **Search bar** (Logged in) |
| Type in the search input | See spinner until API returns results | AE | Pass |
| When results shown, click outside component | Results go away | AE | Pass |
| Click on result shown in results | Taken to that user's profile page | AE | Pass |
| **Sign Up page** (Not logged in) |
| Load Sign Up page | Sign Up page loads | AE | Pass |
| Try to create account with username already taken | Alert shown | AE | Pass |
| Try to create account with email address already taken | Alert shown | AE | Pass |
| Try to create account with with unique details | Take to log in page | AE | Pass |
| **Sign Up page** (Logged in) |
| Load Sign Up page | Get redirect to user profile |Sign Up page loaded| Added logged in user check in commit 85afd54|
| **Sign In page** (Not logged in) |
| Load Sign In page | Sign In page loads | AE | Pass |
| Try to login with incorrect Username | Alert shown | AE | Pass |
| Try to login with incorrect password | Alert shown | AE | Pass |
| Try to login with correct username and password | Taken to profile page | AE | Pass |
| **Sign In page** (Logged in) |
| Load Sign In page | Get redirect to user profile | AE | Pass |
| **Any Profile Page** (Not logged in)|
| Load page | Redirects to sign in| AE | Pass |
| **Own Profile Page** (Logged in)|
| Loads page | Load own profile | AE | Pass |
|  | Should see: Avatar, Username, member since, password change, Email, Tracker.gg, Note box, New post, post timeline | AE | Pass |
|  | Should be able to edit: Avatar, username, password, email tracker, note box, new post, old posts. | AE | Pass |
| Edit own username and try to change to another username in user | Alert shown | AE | Pass |
| Edit own username and try to user forbidden characters like <>$ | Alert shown | AE | Pass |
| Edit own username and change to another unique name | Success | AE | Pass |
| Update Avatar: Try update to non-image file | File cannot be posted | AE | Pass |
| Update Avatar: Try update to image over 2mb| Alert shown | AE | Pass |
| Update Avatar: Try update to image over 1000px height| Alert shown | AE | Pass |
| Update Avatar: Try update to valid image | Success | AE | Pass |
| Update password with old incorrect password | Alert shown | AE | Pass |
| Update password with mismatch new password | Alert shown | AE | Pass |
| Update password following instructions | Success | AE | Pass |
| Update email with incorrect format | Alert shown | AE | Pass |
| Update email with already in use email address | Alert shown | AE | Pass |
| Update email following instructions and is unique | Success | AE | Pass |
| Update tracker ID with incorrect format | Alert shown | AE | Pass |
| Update tracker ID with correct format | Success | AE | Pass |
| Update Note: Enter over 200 characters | Alert shown | AE | Pass |
| Update Note: Enter over 0 characters | Success | AE | Pass |
| Update Note: Enter over `<script>Test</script>` | Should remove malicious code | Allows code to be input on first time, but when edit it cleans the code #75 |
| Update Note: Enter over `This should be valid` | Success | AE | Pass |
| **Other user profile page** (Logged in)|
| Load other user profile page | Loads other user profile page | AE | Pass |
|  | Should see: Avatar, Username, member since,Tracker.gg, Note box, post timeline | AE | Pass |
|  | Should not be able to edit anything except user note box |Could click on edit post, and delete post buttons, though actions were forbidden. #74 |Fixed c73a2fc|
| **Posts** (Logged in)|
| Goto own profile | Can see new post | AE | Pass |
| Goto another user profile | Can not see new post | AE | Pass |
| Goto own profile | Can own posts | AE | Pass |
| Goto another user profile | Can see that user's posts | AE | Pass |
| Goto own profile | Can edit/delete own posts | AE | Pass |
| Goto another user profile |Can not edit/delete own posts | AE | Pass |
| Create text post: Blank | Alert shown | AE | Pass |
| Create text post: Over 400 characters | Alert shown | AE | Pass |
| Create text post: With malicious code i.e `<script>Test</script>` | Cleans code and success | AE | Pass |
| Create text post: With valid text i.e `This is a post` | Success | AE | Pass |
| Create image post: Try to post non-image file | File cannot be posted | AE | Pass |
| Create image post: Try to post image over 2mb| Alert shown | AE | Pass |
| Create image post: Try to post image over 1000px height| Alert shown | AE | Pass |
| Create image and text post: Try to post valid image and text| Should post | AE | Pass |
| Edit Post: Remove all text and save | Should post | AE | Pass |
| Edit Post: Exceed 400 characters | Alert shown | AE | Pass |
| Edit Post: Enter malicious code i.e `<script>Test</script>`| Should post after cleaning code | AE | Pass |
| Delete post: Try to delete post | Correct post is deleted. | AE | Pass |
| **Squad Finder** (Not Logged in)|
| Go to Squad Finder URL | Redirect to sign in | AE | Pass |
| **Squad Finder** (Logged in)|
| Go to Squad Finder URL | Page loads | AE | Pass |
| Create group: Click button | Modal opens | AE | Pass |
| Create group: Try to create a group with no slots | Alert shown | AE | Pass |
| Create group: Try to create group with max rank lower then min | Alert shown | AE | Pass |
| Create group: Try to exceed 200 characters in text box | Alert shown | AE | Pass |
| Create group: Try to enter malicious code in text box i.e `<script>Test</script>` | Input is cleaned and returned safe | Posted but not cleaned #78
| Create group: Select a larger then, open all slots, then reduce team size below slot amount | Slots are automatically removed so there is never the same or more then team size | Code seems to be behind and wrong amount of slots are being shown # 80 | Fixed 6e20a7a
| Create group: In slot try to exceed 100 characters| Alert shown | No alert and text was submitted #79 | fixed 6e20494
| Create group: In slot add malicious code i.e `<script>Test</script>` |
| Create group: Following all rules | Group is created | AE | Pass |
| Disband group: Try to disband group | Group should be disband, allowing user to create new group | AE | Pass |
| Group Search: Use filters to try different combinations | Correct groups should show, without errors  | AE | Pass |
| Slot Apply: Try to exceed 100 character limit | Alert shown | AE | Pass |
| Slot Apply: In text area add malicious code i.e `<script>Test</script>` | Posted but with malicious code |
| Slot Apply: Try to join over 5 slots | Alert shown | AE | Pass |
| My Applications: Edit application : Try to exceed 100 character limit | Alert shown | AE | Pass |
| My Applications: Edit application : Try to make a valid change | Change is saved | If you have 5 applications open you get an error saying you can only have 5 applications open at a time #82| Fixed in API [ddc0c9c7](https://github.com/BobWritesCode/SquadUp_api/commit/ddc0c9c75db92dddc4791977575f4109e80e7a0c)
| Application review: Reject application | Show as rejected | Showed as rejected but if you reject but then reopen modal again the application does not show rejected, but refresh page and it is. It then allows you accept the request. | Fixed [6cd4c25](https://github.com/BobWritesCode/squadup_frontend/commit/6cd4c251e3956b690ae6d8c15fbd933e60dd03f5) |
| Application review: Accept application | Required to input more information | AE | Pass |
| Application review: Accept application Step 2: Exceed over 100 characters | Alert shown | AE | Pass |
| Application review: Accept application Step 2: Enter valid information| Accepts request | AE | Pass |
| Application review: Accept application Step 2: In text input add malicious code i.e `<script>Test</script>`  | Required to input more information | Submit but clean content | AE | Pass |
