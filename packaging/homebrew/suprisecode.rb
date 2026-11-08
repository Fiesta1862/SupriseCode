class Suprisecode < Formula
  desc "SupriseCode remote AI coding agent CLI"
  homepage "https://suprisecode.vercel.app"
  url "https://registry.npmjs.org/@suprisecode/cli/-/cli-0.1.0.tgz"
  version "0.1.0"
  # Replace sha256 with the published npm tarball checksum before submitting.
  sha256 "REPLACE_WITH_NPM_TARBALL_SHA256"
  depends_on "node"

  def install
    system "npm", "install", "--global", "--prefix", prefix, "@suprisecode/cli@#{version}"
    bin.install_symlink Dir[prefix/"bin/"*]
  end

  test do
    assert_match "SupriseCode CLI", shell_output("#{bin}/suprisecode --help")
  end
end
