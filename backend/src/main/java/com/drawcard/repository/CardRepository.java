package com.drawcard.repository;

import com.drawcard.entity.Card;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CardRepository extends JpaRepository<Card, String> {

    List<Card> findByUserIdOrderByCreatedAtDesc(Long userId);

    List<Card> findByUserIdAndDirectionOrderByCreatedAtDesc(Long userId, String direction);
}
