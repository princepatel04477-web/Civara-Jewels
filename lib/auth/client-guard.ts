/**
 * Client-side LAN IP and Seller Network Guard
 * Detects local LAN IP (e.g. 192.168.1.4 or 192.168.1.*) using WebRTC ICE candidates
 * and tags seller devices to prevent any access to or visibility of the admin portal.
 */

export async function checkAndTagSellerLAN(): Promise<boolean> {
  if (typeof window === "undefined") return false;

  // If already tagged in storage or cookie, return true immediately
  if (isSellerDeviceTagged()) {
    tagAsSellerDevice();
    return true;
  }

  return new Promise((resolve) => {
    const RTCPC =
      window.RTCPeerConnection ||
      (window as any).webkitRTCPeerConnection ||
      (window as any).mozRTCPeerConnection;

    if (!RTCPC) {
      resolve(false);
      return;
    }

    let settled = false;
    let pc: RTCPeerConnection | null = null;

    const finish = (isSeller: boolean) => {
      if (!settled) {
        settled = true;
        if (pc) {
          try {
            pc.close();
          } catch {}
        }
        if (isSeller) {
          tagAsSellerDevice();
        }
        resolve(isSeller);
      }
    };

    try {
      pc = new RTCPC({
        iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
      });

      pc.createDataChannel("civara-guard");

      pc.onicecandidate = (event) => {
        if (!event || !event.candidate || !event.candidate.candidate) {
          return;
        }

        const cand = event.candidate.candidate;
        // Detect seller IPs: 192.168.1.4, 192.168.1.18, 192.168.1.* subnet, or 2402:a00:163:58dc
        if (
          cand.includes("192.168.1.4") ||
          cand.includes("192.168.1.18") ||
          cand.includes(" 192.168.1.") ||
          cand.includes(".192.168.1.") ||
          cand.includes("2402:a00:163:58dc")
        ) {
          finish(true);
        }
      };

      pc.createOffer()
        .then((offer) => pc?.setLocalDescription(offer))
        .catch(() => finish(false));

      // Safety timeout after 1.2s
      setTimeout(() => finish(false), 1200);
    } catch {
      resolve(false);
    }
  });
}

export function tagAsSellerDevice() {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem("civara_seller_restricted", "1");
    sessionStorage.setItem("civara_seller_restricted", "1");
    document.cookie = "civara_seller_network=1; path=/; max-age=31536000; SameSite=Lax";
  } catch {}
}

export function isSellerDeviceTagged(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return (
      localStorage.getItem("civara_seller_restricted") === "1" ||
      sessionStorage.getItem("civara_seller_restricted") === "1" ||
      document.cookie.includes("civara_seller_network=1")
    );
  } catch {
    return false;
  }
}
