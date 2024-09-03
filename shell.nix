{pkgs ? import <nixpkgs> {}}:

pkgs.mkShell
{
  # https://www.youtube.com/watch?v=yQwW8dkuHqw&t=131s
  # https://search.nixos.org/
  # https://www.nixhub.io/
  name = "Personal Site";
  nativeBuildInputs = with pkgs; [
    nodejs_20
  ];
  shellHook = ''
    zsh
  '';
}