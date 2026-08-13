package uploads

import (
	"crypto/sha256"
	"encoding/hex"
	"testing"
)

func TestResumableCompletionAndChecksum(t *testing.T) {
	payload := []byte("hello")
	sum := sha256.Sum256(payload)
	s, err := New(2, 10, hex.EncodeToString(sum[:]))
	if err != nil {
		t.Fatal(err)
	}
	if err = s.Record(Part{1, "aabbccddeeff00112233445566778899aabbccddeeff00112233445566778899", 2}); err != nil {
		t.Fatal(err)
	}
	if err = s.Complete(payload); err == nil {
		t.Fatal("expected incomplete")
	}
	_ = s.Record(Part{2, "aabbccddeeff00112233445566778899aabbccddeeff00112233445566778899", 3})
	if err = s.Complete(payload); err != nil {
		t.Fatal(err)
	}
}
func TestLimitsAndMismatch(t *testing.T) {
	if _, err := New(0, 1, ""); err == nil {
		t.Fatal("expected policy error")
	}
	s, _ := New(1, 2, "0")
	_ = s.Record(Part{1, "aabbccddeeff00112233445566778899aabbccddeeff00112233445566778899", 3})
	if err := s.Complete([]byte("bad")); err == nil {
		t.Fatal("expected size error")
	}
}
