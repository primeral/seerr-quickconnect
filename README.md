# Seerr+QC

Seerr+QC is a Seerr fork with Jellyfin Quick Connect support added/restored for Luna, Multi-Auth, and login-agnostic homelab media workflows.

This fork should stay as close to upstream Seerr behavior as practical. The primary delta is Jellyfin Quick Connect support and the Luna/Jellyfin session bootstrap work needed for the biiitch ecosystem sandbox.

## Current alpha focus

- Jellyfin Quick Connect support
- Quick Connect polling and validation fixes
- Luna/Jellyfin session bootstrap routes
- Compatibility with Luna and Multi-Auth
- Third-party-admin reproducibility for future Sandbox 2.0 testing

## Design goals

Seerr+QC should remain focused.

It should not become the identity provider. It should integrate cleanly with Jellyfin, Luna, Multi-Auth, and SMS-Gateway while preserving as much upstream Seerr compatibility as possible.

## Related projects

- Luna: Jellyfin/Moonfin plugin fork for Seerr integration and session bootstrap.
- Multi-Auth: Jellyfin plugin for SMS Quick Connect, SMS login authorization, and future OIDC.
- SMS-Gateway Server: self-hosted SMS transport server.
- SMS-Gateway Client for Android: Android SMS device client.

## Fork status

This is an active Seerr Quick Connect fork. Some internal names, package names, documentation, and comments may still reference Seerr, Jellyseerr, or upstream project names during the alpha transition.
