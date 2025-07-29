import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { KeycloakUserService, User } from '../../../services/keycloak/KeycloakUserService';
import { KeycloakService } from '../../../services/keycloak/keycloak.service';
import { HttpClient } from '@angular/common/http';

declare const ZegoUIKitPrebuilt: any;

@Component({
  selector: 'app-manager-meeting',
  templateUrl: './manager-meeting.component.html',
  styleUrls: ['./manager-meeting.component.css']
})
export class ManagerMeetingComponent implements OnInit {
  users: User[] = [];
  isLoading: boolean = false;
  errorMessage: string = '';
  joinMeetingId: string = '';
  selectedUserIds: string[] = [];
  isMeetingActive: boolean = false;

  @ViewChild('meetingContainer', { static: true }) meetingContainer!: ElementRef;

  private appID = 1645664249;
  private serverSecret = '56362577601fcba8e171057e754ec52e';
  private apiUrl = 'http://localhost:8089/api/email';
  private zp: any;

  constructor(
    private keycloakUserService: KeycloakUserService,
    private keycloakService: KeycloakService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.keycloakUserService.getAllUsers().subscribe({
      next: (users) => {
        console.log('Users loaded for manager:', users);
        this.users = users;
        this.isLoading = false;
      },

    });
  }

  toggleUserSelection(userId: string): void {
    const index = this.selectedUserIds.indexOf(userId);
    if (index === -1) {
      this.selectedUserIds.push(userId);
    } else {
      this.selectedUserIds.splice(index, 1);
    }
  }

  startMeeting(): void {
    if (this.selectedUserIds.length === 0) {
      this.errorMessage = 'Please select at least one user to meet with.';
      return;
    }

    const selectedUsers = this.users.filter(u => this.selectedUserIds.includes(u.id));
    if (selectedUsers.length === 0) {
      this.errorMessage = 'No valid users selected.';
      return;
    }

    const roomID = Math.floor(Math.random() * 10000) + '';
    const tokenParsed = this.keycloakService.tokenParsed;
    const userID = tokenParsed?.sub || Math.floor(Math.random() * 10000) + '';
    const userName = tokenParsed?.preferred_username || `user_${userID}`;

    const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
      this.appID,
      this.serverSecret,
      roomID,
      userID,
      userName
    );

    const meetingUrl = `${window.location.protocol}//${window.location.host}${window.location.pathname}?roomID=${roomID}`;

    // Send email to all selected users
    selectedUsers.forEach(user => {
      this.sendMeetingEmail(user.email, roomID, meetingUrl).subscribe({
        next: () => {
          console.log(`Meeting invitation sent to ${user.email}`);
        },

      });
    });

    // Initialize ZegoCloud meeting
    if (this.meetingContainer && this.meetingContainer.nativeElement) {
      this.zp = ZegoUIKitPrebuilt.create(kitToken);
      this.zp.joinRoom({
        container: this.meetingContainer.nativeElement,
        sharedLinks: [{
          name: 'Personal link',
          url: meetingUrl,
        }],
        scenario: {
          mode: ZegoUIKitPrebuilt.VideoConference,
        },
        turnOnMicrophoneWhenJoining: false,
        turnOnCameraWhenJoining: false,
        showMyCameraToggleButton: true,
        showMyMicrophoneToggleButton: true,
        showAudioVideoSettingsButton: true,
        showScreenSharingButton: true,
        showTextChat: true,
        showUserList: true,
        maxUsers: selectedUsers.length + 1,
        layout: "Auto",
        showLayoutButton: false,
      });
      this.isMeetingActive = true;
      this.selectedUserIds = [];
      this.errorMessage = '';
    } else {
      console.error('Meeting container not found.');
      this.errorMessage = 'Failed to start meeting. Container not found.';
    }
  }

  stopMeeting(): void {
    if (this.zp) {
      this.zp.destroy();
      this.zp = null;
      this.isMeetingActive = false;
      if (this.meetingContainer && this.meetingContainer.nativeElement) {
        this.meetingContainer.nativeElement.innerHTML = '';
      }
    }
  }

  joinMeeting(): void {
    if (!this.joinMeetingId.trim()) {
      this.errorMessage = 'Please enter a valid Meeting ID.';
      return;
    }

    const roomID = this.joinMeetingId.trim();
    const tokenParsed = this.keycloakService.tokenParsed;
    const userID = tokenParsed?.sub || Math.floor(Math.random() * 10000) + '';
    const userName = tokenParsed?.preferred_username || `user_${userID}`;

    const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
      this.appID,
      this.serverSecret,
      roomID,
      userID,
      userName
    );

    if (this.meetingContainer && this.meetingContainer.nativeElement) {
      this.zp = ZegoUIKitPrebuilt.create(kitToken);
      this.zp.joinRoom({
        container: this.meetingContainer.nativeElement,
        sharedLinks: [{
          name: 'Personal link',
          url: `${window.location.protocol}//${window.location.host}${window.location.pathname}?roomID=${roomID}`,
        }],
        scenario: {
          mode: ZegoUIKitPrebuilt.VideoConference,
        },
        turnOnMicrophoneWhenJoining: false,
        turnOnCameraWhenJoining: false,
        showMyCameraToggleButton: true,
        showMyMicrophoneToggleButton: true,
        showAudioVideoSettingsButton: true,
        showScreenSharingButton: true,
        showTextChat: true,
        showUserList: true,
        maxUsers: 10,
        layout: "Auto",
        showLayoutButton: false,
      });
      this.isMeetingActive = true;
      this.joinMeetingId = '';
      this.errorMessage = '';
    } else {
      console.error('Meeting container not found.');
      this.errorMessage = 'Failed to join meeting. Container not found.';
    }
  }

  private sendMeetingEmail(email: string, roomID: string, meetingUrl: string) {
    const emailRequest = {
      to: email,
      subject: 'Meeting Invitation from Manager',
      body: `You have been invited to a meeting by a manager. Join using this link: ${meetingUrl}\nMeeting ID: ${roomID}`
    };
    return this.http.post(`${this.apiUrl}/send`, emailRequest, {
      headers: { 'Authorization': `Bearer ${this.keycloakService.keycloak.token}` }
    });
  }
}
