{ pkgs ? import <nixpkgs> {} }:

pkgs.mkShell {
  buildInputs = with pkgs; [
    gcc
    python39
    python39Packages.pip
    python39Packages.virtualenv
  ];
} 